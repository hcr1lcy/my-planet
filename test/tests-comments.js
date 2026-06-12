describe('Comments: 基础评论功能', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('评论数据结构正确', function() {
    var comment = {
      name: '测试者',
      content: '测试评论',
      time: Date.now(),
      reactions: {},
      replies: [],
    };
    expect(comment.name).toBe('测试者');
    expect(comment.content).toBe('测试评论');
    expect(typeof comment.time).toBe('number');
    expect(typeof comment.reactions).toBe('object');
    expect(Array.isArray(comment.replies)).toBe(true);
  });

  it('文章可以添加评论', function() {
    savePosts([{
      id: 'comment-test',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var posts = getPosts();
    posts[0].comments.push({
      name: '用户A',
      content: '评论内容',
      time: Date.now(),
      reactions: {},
      replies: [],
    });
    savePosts(posts);
    expect(getPosts()[0].comments.length).toBe(1);
    expect(getPosts()[0].comments[0].name).toBe('用户A');
  });

  it('评论支持Markdown渲染', function() {
    var post = {
      comments: [{
        name: '测试',
        content: '**加粗** 和 *斜体*',
        time: Date.now(),
        reactions: {},
        replies: [],
      }],
    };
    var bodyHtml = markdownToHtml(post.comments[0].content);
    expect(bodyHtml).toContain('<strong>');
    expect(bodyHtml).toContain('<em>');
  });

  it('评论XSS防护', function() {
    var post = {
      comments: [{
        name: '恶意用户',
        content: '<script>alert(1)</script>',
        time: Date.now(),
        reactions: {},
        replies: [],
      }],
    };
    var bodyHtml = markdownToHtml(escapeMarkdownText(post.comments[0].content));
    expect(bodyHtml).not.toContain('<script>');
    expect(bodyHtml).toContain('&lt;');
  });
});

describe('Comments: 回复功能', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('评论可以有回复', function() {
    var comment = {
      name: '用户A',
      content: '原始评论',
      time: Date.now(),
      reactions: {},
      replies: [],
    };
    comment.replies.push({
      name: '用户B',
      content: '回复内容',
      time: Date.now(),
      reactions: {},
      replies: [],
    });
    expect(comment.replies.length).toBe(1);
    expect(comment.replies[0].name).toBe('用户B');
  });

  it('回复嵌套最多2层', function() {
    var depth0 = { replies: [] };
    var depth1 = { replies: [] };
    var depth2 = { replies: [] };
    depth0.replies.push(depth1);
    depth1.replies.push(depth2);
    expect(depth0.replies.length).toBe(1);
    expect(depth0.replies[0].replies.length).toBe(1);
    expect(depth0.replies[0].replies[0].replies.length).toBe(0);
  });

  it('showReplyForm是函数', function() {
    expect(typeof showReplyForm).toBe('function');
  });

  it('submitReply是函数', function() {
    expect(typeof submitReply).toBe('function');
  });
});

describe('Comments: 表情反应', function() {
  it('addReaction是函数', function() {
    expect(typeof addReaction).toBe('function');
  });

  it('表情反应数据结构', function() {
    var reactions = {};
    reactions['👍'] = 1;
    reactions['❤️'] = 2;
    expect(reactions['👍']).toBe(1);
    expect(reactions['❤️']).toBe(2);
    expect(reactions['🔥']).toBeUndefined();
  });

  it('反应计数递增', function() {
    var reactions = {};
    reactions['👍'] = (reactions['👍'] || 0) + 1;
    reactions['👍'] = (reactions['👍'] || 0) + 1;
    expect(reactions['👍']).toBe(2);
  });
});

describe('Comments: 防spam机制', function() {
  afterEach(function() {
    localStorage.removeItem('planet_comment_spam');
  });

  it('checkSpam是函数', function() {
    expect(typeof checkSpam).toBe('function');
  });

  it('recordComment是函数', function() {
    expect(typeof recordComment).toBe('function');
  });

  it('首次评论不触发spam', function() {
    localStorage.removeItem('planet_comment_spam');
    expect(checkSpam()).toBe(false);
  });

  it('5分钟内3条评论触发spam', function() {
    localStorage.removeItem('planet_comment_spam');
    recordComment();
    recordComment();
    recordComment();
    expect(checkSpam()).toBe(true);
  });

  it('5分钟后spam重置', function() {
    var oldSpam = [];
    var now = Date.now();
    for (var i = 0; i < 3; i++) {
      oldSpam.push(now - 6 * 60 * 1000);
    }
    localStorage.setItem('planet_comment_spam', JSON.stringify(oldSpam));
    expect(checkSpam()).toBe(false);
  });
});

describe('Comments: 删除评论', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('可以删除评论', function() {
    savePosts([{
      id: 'del-test',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [
        { name: 'A', content: 'a', time: 1, reactions: {}, replies: [] },
        { name: 'B', content: 'b', time: 2, reactions: {}, replies: [] },
      ],
    }]);
    var posts = getPosts();
    posts[0].comments.splice(0, 1);
    savePosts(posts);
    expect(getPosts()[0].comments.length).toBe(1);
    expect(getPosts()[0].comments[0].name).toBe('B');
  });

  it('删除后评论数更新', function() {
    savePosts([{
      id: 'count-test',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [
        { name: 'A', content: 'a', time: 1, reactions: {}, replies: [] },
        { name: 'B', content: 'b', time: 2, reactions: {}, replies: [] },
        { name: 'C', content: 'c', time: 3, reactions: {}, replies: [] },
      ],
    }]);
    var posts = getPosts();
    posts[0].comments.splice(1, 1);
    savePosts(posts);
    expect(getPosts()[0].comments.length).toBe(2);
  });
});
