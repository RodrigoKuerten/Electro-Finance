import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  imports: [CommonModule, RouterLink],
})
export class Landing implements AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('cursorSpotlight') cursorSpotlight!: ElementRef<HTMLDivElement>;

  private shimmerInterval: ReturnType<typeof setInterval> | null = null;
  private shimmerInitTimeout: ReturnType<typeof setTimeout> | null = null;
  private eventCleanups: Array<() => void> = [];

  private spotX = -300;
  private spotY = -300;
  private spotTargetX = -300;
  private spotTargetY = -300;
  private spotRafId: number | null = null;

  ngAfterViewInit(): void {
    const video = this.heroVideo.nativeElement;
    video.muted = true;
    video.play().catch(() => {});

    this.initGsapAnimations();
    this.initCursorSpotlight();
    this.initCardBorderGlow();
  }

  ngOnDestroy(): void {
    if (this.spotRafId !== null) cancelAnimationFrame(this.spotRafId);
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.globalTimeline.clear();
    if (this.shimmerInterval) clearInterval(this.shimmerInterval);
    if (this.shimmerInitTimeout) clearTimeout(this.shimmerInitTimeout);
    this.eventCleanups.forEach(fn => fn());
  }

  private initGsapAnimations(): void {
    this.animateChartBars();
    this.animateMockupTilt();
    this.animateScrollReveals();
    this.animateStatCounters();
    this.animateStatIcons();
    this.animateCtaShimmer();
    this.animateCtaArrows();
  }

  private initCursorSpotlight(): void {
    if ('ontouchstart' in window) return;

    const el = this.cursorSpotlight.nativeElement;
    const half = 300;

    const onMove = (e: MouseEvent) => {
      this.spotTargetX = e.clientX;
      this.spotTargetY = e.clientY;
    };

    document.addEventListener('mousemove', onMove);
    this.eventCleanups.push(() => document.removeEventListener('mousemove', onMove));

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      this.spotX = lerp(this.spotX, this.spotTargetX, 0.08);
      this.spotY = lerp(this.spotY, this.spotTargetY, 0.08);
      el.style.transform = `translate(${this.spotX - half}px, ${this.spotY - half}px)`;
      this.spotRafId = requestAnimationFrame(animate);
    };

    this.spotRafId = requestAnimationFrame(animate);
  }

  private initCardBorderGlow(): void {
    if ('ontouchstart' in window) return;

    document.querySelectorAll<HTMLElement>('.feat-card, .step-card').forEach(card => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      };
      card.addEventListener('mousemove', onMove);
      this.eventCleanups.push(() => card.removeEventListener('mousemove', onMove));
    });
  }

  private animateChartBars(): void {
    gsap.fromTo(
      '.cbar',
      { scaleY: 0, opacity: 0, transformOrigin: 'bottom' },
      {
        scaleY: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'power4.out',
        stagger: { each: 0.07, from: 'start' },
        delay: 0.6,
      }
    );
  }

  private animateMockupTilt(): void {
    const visual = document.querySelector<HTMLElement>('.hero-visual');
    const wrap = document.querySelector<HTMLElement>('.mockup-tilt-wrap');
    if (!visual || !wrap) return;

    const onMove = (e: MouseEvent) => {
      const rect = visual.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to(wrap, {
        rotationY: x * 8,
        rotationX: -y * 6,
        transformPerspective: 900,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onLeave = () => {
      gsap.to(wrap, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    visual.addEventListener('mousemove', onMove);
    visual.addEventListener('mouseleave', onLeave);
    this.eventCleanups.push(() => {
      visual.removeEventListener('mousemove', onMove);
      visual.removeEventListener('mouseleave', onLeave);
    });
  }

  private animateScrollReveals(): void {
    const defaults = { opacity: 0, y: 30, duration: 0.65, ease: 'power2.out' };

    document.querySelectorAll<HTMLElement>('.section-head').forEach(el => {
      gsap.from(el, {
        ...defaults,
        y: 20,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    gsap.from('.stats-bar', {
      opacity: 0,
      scale: 0.99,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.stats-bar', start: 'top 85%', once: true },
    });

    document.querySelectorAll<HTMLElement>('.stat').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: { trigger: '.stats-bar', start: 'top 85%', once: true },
      });
    });

    document.querySelectorAll<HTMLElement>('.feat-card').forEach((el, i) => {
      gsap.from(el, {
        ...defaults,
        delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });

    document.querySelectorAll<HTMLElement>('.step-card').forEach((el, i) => {
      gsap.from(el, {
        ...defaults,
        delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });

    document.querySelectorAll<HTMLElement>('.testi-card').forEach((el, i) => {
      gsap.from(el, {
        ...defaults,
        delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });

    gsap.from('.cta-card', {
      opacity: 0,
      y: 20,
      scale: 0.98,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.cta-card', start: 'top 85%', once: true },
    });

    gsap.from('.footer-brand', {
      opacity: 0,
      x: -20,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.footer-brand', start: 'top 92%', once: true },
    });

    document.querySelectorAll<HTMLElement>('.footer-col').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: { trigger: el, start: 'top 93%', once: true },
      });
    });
  }

  private animateStatCounters(): void {
    const statNums = document.querySelectorAll<HTMLElement>('.stat-num');
    const configs: Array<{ end: number; format: (v: number) => string; hasStar?: boolean }> = [
      { end: 10,   format: v => `${Math.round(v)}k+` },
      { end: 2,    format: v => `R$ ${Math.round(v)}M+` },
      { end: 99.9, format: v => `${v.toFixed(1).replace('.', ',')}%` },
      { end: 4.9,  format: v => v.toFixed(1).replace('.', ','), hasStar: true },
    ];

    statNums.forEach((el, i) => {
      const cfg = configs[i];
      if (!cfg) return;
      const starSpan = el.querySelector('.stat-star');
      const obj = { val: 0 };

      gsap.to(obj, {
        val: cfg.end,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          if (starSpan && el.firstChild) {
            el.firstChild.textContent = cfg.format(obj.val);
          } else {
            el.textContent = cfg.format(obj.val);
          }
        },
        scrollTrigger: { trigger: '.stats-bar', start: 'top 80%', once: true },
      });
    });
  }

  private animateStatIcons(): void {
    gsap.to('.stat-icon', {
      opacity: 0.5,
      duration: 2.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.45, from: 'start' },
    });
  }

  private animateCtaShimmer(): void {
    const shimmers = document.querySelectorAll<HTMLElement>('.btn-shimmer');
    if (!shimmers.length) return;

    const play = () => {
      gsap.fromTo(
        shimmers,
        { x: '-150%', skewX: -15 },
        { x: '270%', skewX: -15, duration: 0.85, ease: 'power2.inOut', stagger: 0.2 }
      );
    };

    this.shimmerInitTimeout = setTimeout(() => {
      play();
      this.shimmerInterval = setInterval(play, 3000);
    }, 1800);
  }

  private animateCtaArrows(): void {
    const btns = document.querySelectorAll<HTMLElement>('.cta-primary, .cta-btn');

    btns.forEach(btn => {
      const arrow = btn.querySelector<SVGElement>('svg');
      if (!arrow) return;

      let tween: gsap.core.Tween | null = null;

      const onEnter = () => {
        tween = gsap.to(arrow, {
          x: 5,
          duration: 0.32,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      };

      const onLeave = () => {
        tween?.kill();
        tween = null;
        gsap.to(arrow, { x: 0, duration: 0.22, ease: 'power2.out' });
      };

      btn.addEventListener('mouseenter', onEnter);
      btn.addEventListener('mouseleave', onLeave);
      this.eventCleanups.push(() => {
        btn.removeEventListener('mouseenter', onEnter);
        btn.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
