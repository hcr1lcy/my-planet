---
title: 用 CSS 打造科幻风格界面
date: 2026-06-10
tags: [前端, CSS, 教程]
categories: 技术
---

科幻风格的界面设计并不复杂，关键在于几个核心元素的组合。

## 核心元素

### 1. 深色背景 + 渐变

```css
body {
    background: radial-gradient(ellipse at 20% 50%, #0a0e2a 0%, #000 70%);
}
```

### 2. 霓虹色发光效果

```css
.neon {
    color: #00f0ff;
    text-shadow: 0 0 10px rgba(0,240,255,0.5);
}
```

### 3. 扫描线覆盖层

```css
.scanline {
    background: repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
    );
}
```

### 4. 卡片悬浮效果

利用 `perspective` 和 `rotateY/rotateX` 实现 3D 倾斜。

## 总结

科幻风格的本质是**对比** — 黑暗中的光芒，冷酷中的温度。
