/**
 * DMD课程网站JavaScript文件
 * 提供现代化的交互体验
 */

// 移动端兼容性检查和错误处理
(function() {
    'use strict';
    
    // 检测移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 设置全局错误处理
    window.addEventListener('error', function(e) {
        console.warn('JavaScript错误:', e.error);
        // 不中断页面功能
        return true;
    });
    
    // Promise错误处理
    window.addEventListener('unhandledrejection', function(e) {
        console.warn('未处理的Promise拒绝:', e.reason);
        e.preventDefault();
    });
    
    // 检查关键API支持
    function checkBrowserSupport() {
        const features = {
            intersectionObserver: 'IntersectionObserver' in window,
            requestAnimationFrame: 'requestAnimationFrame' in window,
            localStorage: 'localStorage' in window,
            classList: 'classList' in document.createElement('div'),
            addEventListener: 'addEventListener' in window
        };
        
        // 为不支持的功能提供polyfill或fallback
        if (!features.intersectionObserver) {
            // 简单的fallback，直接显示所有动画元素
            window.IntersectionObserver = function(callback) {
                return {
                    observe: function(el) {
                        setTimeout(function() {
                            callback([{isIntersecting: true, target: el}]);
                        }, 100);
                    },
                    disconnect: function() {}
                };
            };
        }
        
        if (!features.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                return setTimeout(callback, 16);
            };
        }
        
        return features;
    }
    
    // 初始化浏览器支持检查
    const browserSupport = checkBrowserSupport();
    console.log('浏览器支持情况:', browserSupport);
    
    // 为移动端添加特殊类
    if (isMobile) {
        document.documentElement.classList.add('mobile-device');
    }
})();

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeWebsite();
    } catch (error) {
        console.error('网站初始化失败:', error);
        // 即使初始化失败，也要确保基本功能可用
        initializeBasicFunctionality();
    }
});

/**
 * 基础功能初始化（错误情况下的fallback）
 */
function initializeBasicFunctionality() {
    try {
        // 基本的导航功能
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
        
        // 基本的移动端菜单
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    } catch (error) {
        console.error('基础功能初始化失败:', error);
    }
}

/**
 * 初始化网站功能
 */
function initializeWebsite() {
    try {
        initializeNavigation();
    } catch (e) {
        console.warn('导航初始化失败:', e);
    }
    
    try {
        initializeScrollEffects();
    } catch (e) {
        console.warn('滚动效果初始化失败:', e);
    }
    
    try {
        initializeFormHandling();
    } catch (e) {
        console.warn('表单处理初始化失败:', e);
    }
    
    try {
        initializeAnimations();
    } catch (e) {
        console.warn('动画初始化失败:', e);
    }
    
    try {
        initializeMobileMenu();
    } catch (e) {
        console.warn('移动端菜单初始化失败:', e);
    }
}

/**
 * 导航功能初始化
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时高亮当前导航项
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 滚动效果初始化
 */
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    // 导航栏背景透明度变化
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // 懒加载动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为所有卡片添加观察
    const animatedElements = document.querySelectorAll('.overview-card, .resource-card, .timeline-item, .announcement-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

/**
 * 表单处理初始化
 */
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
    
    // 实时验证
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

/**
 * 处理表单提交
 */
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // 验证表单
    if (!validateForm(form)) {
        return;
    }
    
    // 显示提交中状态
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // 模拟提交过程
    setTimeout(() => {
        showNotification('问题提交成功！我们会尽快回复您。', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

/**
 * 验证表单
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * 验证单个字段
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // 必填验证
    if (field.hasAttribute('required') && !value) {
        errorMessage = '此字段为必填项';
        isValid = false;
    }
    
    // 邮箱验证
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = '请输入有效的邮箱地址';
            isValid = false;
        }
    }
    
    // 电话验证
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            errorMessage = '请输入有效的电话号码';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

/**
 * 显示字段错误
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.style.borderColor = '#ef4444';
    field.parentNode.appendChild(errorElement);
}

/**
 * 清除字段错误
 */
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // 样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem',
        borderRadius: '0.5rem',
        color: 'white',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    });
    
    // 根据类型设置背景色
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 关闭按钮
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // 自动关闭
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

/**
 * 移除通知
 */
function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * 动画初始化
 */
function initializeAnimations() {
    // 数字计数动画
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 20;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 100);
        });
    };
    
    // 观察器用于触发计数动画
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.disconnect();
            }
        });
    });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

/**
 * 移动端菜单初始化
 */
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // 切换菜单显示
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // 动画效果
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // 点击链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // 点击菜单外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 防抖函数
 */
function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}