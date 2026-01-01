# Contributing to JSONLab

Thank you for your interest in contributing to JSONLab! 🎉

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/jsonlab.git`
3. **Create** a branch: `git checkout -b feature/your-feature-name`
4. **Make** your changes
5. **Test** locally by opening `index.html` in browser
6. **Commit** and **push**: `git commit -m "Add feature" && git push`
7. **Create** a Pull Request

## 🛠️ Development Setup

JSONLab is a **static site** - no build process needed!

```bash
# Clone the repo
git clone https://github.com/baleashvar/jsonlab.git
cd jsonlab

# Open in browser (or use a local server)
# Option 1: Direct file
open index.html

# Option 2: Local server (recommended)
npx serve .
# or
python -m http.server 8000
```

## 📁 Project Structure

```
jsonlab/
├── index.html              # Main page
├── tools/                  # All tools
│   ├── formatter/          # JSON Formatter
│   ├── python/            # Python Compiler
│   ├── react/             # React Playground
│   └── golang/            # Go Compiler
├── ai-tools/              # AI-related tools
├── blog/                  # Blog posts
├── src/css/               # Styles
└── public/                # Static assets
```

## 🎯 How to Contribute

### 🐛 Bug Reports
- Use GitHub Issues
- Include browser/OS info
- Provide steps to reproduce
- Add screenshots if helpful

### ✨ Feature Requests
- Check existing issues first
- Describe the use case
- Explain why it's valuable
- Keep it simple and focused

### 🔧 Code Contributions

#### **Adding New Tools**
1. Create folder: `tools/your-tool/`
2. Add `index.html` with consistent structure
3. Follow existing patterns (see `tools/formatter/`)
4. Add to main page navigation
5. Test on mobile devices

#### **Improving Existing Tools**
- Keep changes minimal and focused
- Maintain backward compatibility
- Test thoroughly before submitting

#### **Code Style**
- **HTML**: Clean, semantic markup
- **CSS**: Use Tailwind classes when possible
- **JavaScript**: Vanilla JS, no frameworks
- **Mobile-first**: Always test on mobile
- **Privacy-first**: No external tracking

## 🎨 Design Guidelines

- **Fast loading**: Optimize for speed
- **Mobile-friendly**: Touch-first design
- **Dark mode**: Support both themes
- **Accessibility**: Proper ARIA labels
- **Consistent**: Follow existing patterns

## 🧪 Testing

Before submitting:
- ✅ Test on Chrome, Firefox, Safari
- ✅ Test on mobile devices
- ✅ Test dark/light themes
- ✅ Verify no console errors
- ✅ Check responsive design

## 📝 Pull Request Guidelines

### Good PR Title Examples:
- `Add JavaScript minifier tool`
- `Fix mobile layout in JSON formatter`
- `Improve Python compiler error handling`

### PR Description Should Include:
- **What** changed
- **Why** it was needed
- **How** to test it
- Screenshots (if UI changes)

### PR Checklist:
- [ ] Tested locally
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] No console errors
- [ ] Follows existing patterns

## 🏷️ Issue Labels

- `good first issue` - Perfect for beginners
- `enhancement` - New features
- `bug` - Something broken
- `help wanted` - Need community help
- `documentation` - Docs improvements

## 💡 Ideas for Contributions

### 🔥 High Priority
- **New Tools**: CSS minifier, HTML formatter, SQL formatter
- **Compilers**: JavaScript playground, TypeScript compiler
- **Mobile**: Better touch interactions
- **Performance**: Faster loading, smaller bundles

### 🎯 Medium Priority
- **Accessibility**: Better screen reader support
- **Themes**: More color schemes
- **Export**: Save/load functionality
- **Shortcuts**: More keyboard shortcuts

### 🌟 Nice to Have
- **Offline**: Better PWA support
- **Sharing**: URL-based code sharing
- **Templates**: Code snippets/examples
- **Plugins**: Extensible architecture

## 🤝 Community

- **Be respectful** and inclusive
- **Help others** learn and contribute
- **Keep discussions** focused and constructive
- **Ask questions** if anything is unclear

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Ready to contribute?** Check out [good first issues](https://github.com/baleashvar/jsonlab/labels/good%20first%20issue) to get started! 🚀