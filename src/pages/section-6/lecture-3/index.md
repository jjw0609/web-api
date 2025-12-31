# Performance Observer

## 1. Web Vitals & Performance API

### Web Vitals
- **LCP (Largest Contentful Paint)**
- **CLS (Cumulative Layout Shift)** 
- **INP (Interaction to Next Paint)**
  - **Long Task**
...

### Measurement Methods
- Chrome DevTools Performance tab
- Measure with code and logging (using Web API)

---

## 2. Performance API vs Performance Observer

### Performance API
```javascript
performance.now()                           // Time measurement
performance.getEntriesByType('navigation')  // DOM load time
```

**Limitations:**
- Limited measurement information
- Cannot detect Long Task, Layout Shift, etc. in real-time

### Performance Observer
```javascript
const observer = new PerformanceObserver((list) => {
  // Real-time callback execution
});
observer.observe({ type: 'longtask', buffered: true });
```

**Advantages:**
- Real-time event detection
- Immediate callback execution
- Web Vitals measurement capability 
