/* André Claudino — profile page interactions:
   theme toggle, mobile nav, scroll reveal, animated counters, skill bars,
   Mermaid rendering (re-rendered on theme change) and active-nav highlight. */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "ac-theme";

  /* ---------- Theme ---------- */
  function preferredTheme() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {
      /* storage unavailable */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* storage unavailable */
    }
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      button.setAttribute("title", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    if (window.mermaid && typeof window.renderMermaid === "function") {
      window.renderMermaid();
    }
  }

  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    }

    /* ---------- Mobile nav ---------- */
    var navToggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* ---------- Scroll reveal ---------- */
    var reveals = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animateCount(element) {
      var target = parseFloat(element.getAttribute("data-target")) || 0;
      var prefix = element.getAttribute("data-prefix") || "";
      var suffix = element.getAttribute("data-suffix") || "";
      var decimals = parseInt(element.getAttribute("data-decimals") || "0", 10);
      if (reduceMotion) {
        element.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }
      var start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / 1100, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function fillBar(bar) {
      var value = bar.getAttribute("data-value") || "0";
      requestAnimationFrame(function () {
        bar.style.width = value + "%";
      });
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
            entry.target.querySelectorAll(".js-count").forEach(animateCount);
            entry.target.querySelectorAll(".skillbar__fill").forEach(fillBar);
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach(function (element) {
        observer.observe(element);
      });
    } else {
      reveals.forEach(function (element) {
        element.classList.add("is-visible");
      });
      document.querySelectorAll(".js-count").forEach(animateCount);
      document.querySelectorAll(".skillbar__fill").forEach(fillBar);
    }

    /* ---------- Active nav link ---------- */
    var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
    if (sections.length && navLinks.length && "IntersectionObserver" in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach(function (section) {
        spy.observe(section);
      });
    }
  });

  /* ---------- Mermaid ---------- */
  var diagramSources = [];

  function captureDiagrams() {
    document.querySelectorAll("pre.mermaid").forEach(function (node) {
      diagramSources.push({ node: node, source: node.textContent.trim() });
    });
  }

  function mermaidVariables() {
    var dark = root.getAttribute("data-theme") === "dark";
    return dark
      ? {
          background: "#151519",
          primaryColor: "#2e1a4d",
          primaryTextColor: "#ede9fe",
          primaryBorderColor: "#7c3aed",
          lineColor: "#71717a",
          secondaryColor: "#14263f",
          secondaryTextColor: "#dbeafe",
          secondaryBorderColor: "#3b82f6",
          tertiaryColor: "#0f2e26",
          tertiaryTextColor: "#d1fae5",
          tertiaryBorderColor: "#10b981",
          fontSize: "15px",
          fontFamily: "Inter, system-ui, sans-serif"
        }
      : {
          background: "#ffffff",
          primaryColor: "#ede9fe",
          primaryTextColor: "#3b0764",
          primaryBorderColor: "#7c3aed",
          lineColor: "#a1a1aa",
          secondaryColor: "#dbeafe",
          secondaryTextColor: "#0c4a6e",
          secondaryBorderColor: "#3b82f6",
          tertiaryColor: "#d1fae5",
          tertiaryTextColor: "#064e3b",
          tertiaryBorderColor: "#10b981",
          fontSize: "15px",
          fontFamily: "Inter, system-ui, sans-serif"
        };
  }

  window.renderMermaid = function () {
    if (!window.mermaid) return;
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      themeVariables: mermaidVariables(),
      flowchart: { curve: "basis", htmlLabels: true },
      sequence: { useMaxWidth: true },
      state: { useMaxWidth: true },
      er: { useMaxWidth: true }
    });
    diagramSources.forEach(function (entry) {
      entry.node.removeAttribute("data-processed");
      entry.node.innerHTML = entry.source;
    });
    try {
      window.mermaid.run({ nodes: diagramSources.map(function (e) { return e.node; }) });
    } catch (e) {
      /* leave sources visible as text if rendering fails */
    }
  };

  function bootMermaid() {
    captureDiagrams();
    window.renderMermaid();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootMermaid);
  } else {
    bootMermaid();
  }
})();
