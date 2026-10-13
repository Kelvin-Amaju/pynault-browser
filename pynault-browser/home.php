<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <meta name="theme-color" content="#080c0d" />
    <meta
      name="description"
      content="Meet Pynault. A beautifully considered browser with built-in privacy controls, flexible tabs, helpful plugins and seamless link sharing across devices."
    />
    <meta property="og:title" content="Pynault — Browse Beyond." />
    <meta
      property="og:description"
      content="A quieter, more personal way to explore the web. Built for desktop and mobile."
    />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="assets/img/aurora-pynault.png" />
    <title>Pynault Browser — Browse Beyond.</title>
    <link rel="icon" href="assets/img/pynault-mark.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Syne:wght@500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link href="assets/vendor/bootstrap.min.css" rel="stylesheet" />
    <link href="assets/vendor/bootstrap-icons.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/style.css" />
  </head>
  <body>
    <div id="preloader" aria-hidden="true">
      <span class="preloader-logo"
        ><img src="assets/img/pynault-mark.png" alt="" /></span
      ><span class="preloader-line"></span><small>THE WEB, REIMAGINED</small>
    </div>
    <div class="scroll-progress" id="scrollProgress"></div>
    <div class="grain" aria-hidden="true"></div>

    <header class="site-header" id="siteHeader">
      <div class="container-xxl">
        <nav class="top-navigation" aria-label="Main navigation">
          <a class="brand" href="#top" aria-label="Pynault home"
            ><img src="assets/img/pynault-mark.png" alt="" /><span
              >pynault<span class="brand-period">.</span></span
            ></a
          >
          <div class="nav-links" id="navLinks">
            <a href="#experience">Experience</a><a href="#features">Features</a
            ><a href="#privacy">Privacy</a><a href="#connected">Connected</a
            ><a href="#faq">FAQ</a>
          </div>
          <div class="nav-actions">
            <a href="#download" class="nav-download"
              ><span>Get Pynault</span><i class="bi bi-arrow-up-right"></i></a
            ><button
              class="menu-toggle"
              id="menuToggle"
              aria-controls="navLinks"
              aria-expanded="false"
              aria-label="Toggle menu"
            >
              <i class="bi bi-list"></i>
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="heroTitle">
        <div class="hero-rings" aria-hidden="true">
          <div class="hero-ring ring-one"></div>
          <div class="hero-ring ring-two"></div>
        </div>
        <div class="hero-ambient" aria-hidden="true"></div>
        <div class="container-xxl hero-layout">
          <div class="hero-copy">
            <div class="eyebrow hero-eyebrow" data-reveal>
              <span class="eyebrow-star">✳</span> A FRESH WAY TO FEEL ONLINE
              <span class="eyebrow-line"></span> 001—026
            </div>
            <h1 id="heroTitle" class="hero-title" data-reveal>
              Go further.<br /><span>Feel <em>freer.</em></span>
            </h1>
            <p class="hero-description" data-reveal>
              Meet the browser that makes more room for the good stuff. Less
              noise, more control, and a web that moves with you.
            </p>
            <div class="hero-buttons" data-reveal>
              <a
                class="btn-lime button-magnetic"
                id="heroDownload"
                href="#download"
                ><span id="heroDownloadLabel">Get Pynault</span
                ><span class="arrow-circle"
                  ><i class="bi bi-arrow-down-right"></i></span
              ></a>
              <a class="btn-outline-hero" href="#experience"
                ><span class="play-ring"><i class="bi bi-play-fill"></i></span>
                Take a closer look</a
              >
            </div>
            <div class="hero-caption" data-reveal>
              <div class="glow-dot"></div>
              <span>Made for desktop. At home on mobile.</span
              ><span class="caption-divider"></span
              ><span>Development preview</span>
            </div>
          </div>
          <div class="hero-decor" aria-hidden="true">
            <span class="hero-decor-orbit"></span
            ><span class="hero-decor-label">INTERNET / REIMAGINED</span
            ><img src="assets/img/pynault-mark.png" alt="" />
          </div>
          <div class="hero-browser-wrap" id="heroBrowser" data-reveal>
            <div class="browser-shadow"></div>
            <div
              class="browser-window"
              role="img"
              aria-label="Pynault desktop browser concept showing its sidebar, horizontal tabs, aurora start page and reading list"
            >
              <div class="browser-topbar">
                <div class="browser-top-logo">
                  <img src="assets/img/pynault-mark.png" alt="" /><span
                    >PYNAULT</span
                  >
                </div>
                <div class="browser-tab active">
                  <i class="bi bi-house"></i> New tab <i class="bi bi-x"></i>
                </div>
                <div class="browser-tab">
                  <i class="bi bi-github"></i> GitHub <i class="bi bi-x"></i>
                </div>
                <div class="browser-tab third-tab">
                  <i class="bi bi-file-earmark-text"></i> Research
                  <i class="bi bi-x"></i>
                </div>
                <span class="browser-tab-plus">+</span>
                <div class="window-tools">
                  <i class="bi bi-dash"></i><i class="bi bi-square"></i
                  ><i class="bi bi-x-lg"></i>
                </div>
              </div>
              <div class="browser-toolbar">
                <div class="toolbar-controls">
                  <i class="bi bi-arrow-left"></i
                  ><i class="bi bi-arrow-right"></i
                  ><i class="bi bi-arrow-clockwise"></i>
                </div>
                <div class="browser-address">
                  <i class="bi bi-search"></i
                  ><span>Search the web or ask Pynault...</span
                  ><i class="bi bi-stars"></i>
                </div>
                <i class="bi bi-download"></i
                ><span class="browser-avatar">A</span
                ><i class="bi bi-three-dots-vertical"></i>
              </div>
              <div class="browser-inner">
                <aside class="browser-sidebar">
                  <div class="preview-menu-item selected">
                    <i class="bi bi-house"></i> Home
                  </div>
                  <div class="preview-menu-item">
                    <i class="bi bi-collection"></i> Spaces
                  </div>
                  <div class="preview-subitem">
                    <span class="tiny-lime-dot"></span> Personal
                  </div>
                  <div class="preview-subitem">
                    <i class="bi bi-folder"></i> Work
                  </div>
                  <div class="preview-subitem">
                    <i class="bi bi-folder2"></i> Projects
                  </div>
                  <div class="sidebar-sep"></div>
                  <div class="preview-menu-item">
                    <i class="bi bi-bookmark"></i> Bookmarks
                  </div>
                  <div class="preview-menu-item">
                    <i class="bi bi-clock-history"></i> History
                  </div>
                  <div class="preview-menu-item">
                    <i class="bi bi-download"></i> Downloads
                  </div>
                  <div class="preview-menu-item">
                    <i class="bi bi-puzzle"></i> Plugins
                  </div>
                  <div class="preview-sidebar-bottom">
                    <i class="bi bi-gear"></i> Settings
                  </div>
                </aside>
                <div class="browser-content">
                  <div class="browser-wallpaper"></div>
                  <div class="browser-center">
                    <img
                      src="assets/img/pynault-mark.png"
                      class="preview-center-logo"
                      alt=""
                    />
                    <div class="preview-wordmark">PYNAULT</div>
                    <div class="preview-tagline">Browse Beyond.</div>
                    <div class="preview-search">
                      <i class="bi bi-search"></i> Search the web or ask Pynault
                      <span><i class="bi bi-arrow-right"></i></span>
                    </div>
                    <div class="preview-shortcuts">
                      <div>
                        <i class="bi bi-youtube"></i><small>YouTube</small>
                      </div>
                      <div>
                        <i class="bi bi-github"></i><small>GitHub</small>
                      </div>
                      <div>
                        <i class="bi bi-google"></i><small>Google</small>
                      </div>
                      <div>
                        <i class="bi bi-grid-fill"></i><small>Apps</small>
                      </div>
                      <div><i class="bi bi-plus-lg"></i><small>Add</small></div>
                    </div>
                  </div>
                  <span class="browser-bottom-copy"
                    >A calmer way to the web.</span
                  >
                </div>
                <aside class="browser-widgets">
                  <div class="weather-widget">
                    <span>MON, JUN 16</span
                    ><strong>10:24 <small>AM</small></strong>
                    <div>Make today yours. <i class="bi bi-sun"></i></div>
                  </div>
                  <div class="reading-widget">
                    <div class="reading-head">
                      <i class="bi bi-journal-bookmark"></i> Reading list
                      <span>See all <i class="bi bi-arrow-up-right"></i></span>
                    </div>
                    <div class="read-row">
                      <div class="read-thumb first"></div>
                      <div>
                        Designing for a quieter web<small>4 min read</small>
                      </div>
                    </div>
                    <div class="read-row">
                      <div class="read-thumb second"></div>
                      <div>The art of deep work<small>6 min read</small></div>
                    </div>
                    <div class="read-row">
                      <div class="read-thumb third"></div>
                      <div>New ideas, new tabs<small>3 min read</small></div>
                    </div>
                  </div>
                  <div class="widget-last">
                    <span>Stay in flow.</span
                    ><small
                      >A little less distraction. A lot more possibility.</small
                    ><b>↗</b>
                  </div>
                </aside>
              </div>
            </div>
            <div class="float-pill floating-privacy">
              <span><i class="bi bi-shield-check"></i></span>
              <div>
                <b>You're in control</b><small>Built-in privacy tools</small>
              </div>
              <i class="bi bi-check2"></i>
            </div>
            <div class="float-pill floating-link">
              <span><i class="bi bi-phone"></i></span>
              <div><b>Take it with you</b><small>Desktop ↔ Mobile</small></div>
              <i class="bi bi-arrow-up-right"></i>
            </div>
          </div>
        </div>
        <div class="hero-bottomline container-xxl">
          <span>DESIGNED FOR THE OPEN WEB</span
          ><a href="#intro"
            >SCROLL TO EXPLORE <i class="bi bi-arrow-down"></i></a
          ><span>V 0.3 / PREVIEW</span>
        </div>
      </section>

      <div class="kinetic-band" aria-hidden="true">
        <div class="kinetic-track">
          <span>MORE WEB. LESS NOISE.</span><i>✳</i
          ><span>MORE WEB. LESS NOISE.</span><i>✳</i
          ><span>MORE WEB. LESS NOISE.</span><i>✳</i
          ><span>MORE WEB. LESS NOISE.</span><i>✳</i>
        </div>
      </div>

      <section class="section-intro light-section" id="intro">
        <div class="container-xxl">
          <div class="row gy-5 align-items-end">
            <div class="col-lg-5">
              <div class="section-label" data-reveal>
                <span class="label-bullet"></span> THE PYNAULT WAY
                <span>01 / 05</span>
              </div>
              <h2 class="display-heading" data-reveal>
                Browsing<br />should feel<br /><span class="serif-word"
                  >beautifully</span
                >
                simple<span class="lime-period">.</span>
              </h2>
            </div>
            <div class="col-lg-6 offset-lg-1">
              <div class="intro-copy" data-reveal>
                <p>
                  Somewhere along the way, the internet got loud. Endless
                  popups, crowded tabs, too many things asking for your
                  attention.
                </p>
                <p>
                  <strong>Pynault brings the feeling back.</strong> A little
                  breathing room for your next big idea, everyday discovery, or
                  just getting things done.
                </p>
                <a href="#experience" class="underline-link"
                  >Discover the experience <i class="bi bi-arrow-up-right"></i
                ></a>
              </div>
            </div>
          </div>
          <div class="small-manifesto" data-reveal>
            <span>OPEN YOUR WORLD</span><span>KEEP YOUR SPACE</span
            ><span>MOVE YOUR WAY</span>
          </div>
        </div>
      </section>

      <section class="features-showcase light-section" id="experience">
        <div class="container-xxl">
          <div class="row mb-5 align-items-end g-4">
            <div class="col-lg-7">
              <div class="section-label" data-reveal>
                <span class="label-bullet"></span> THE EXPERIENCE
                <span>02 / 05</span>
              </div>
              <h2 class="display-heading" data-reveal>
                Everything in its<br /><span class="serif-word"
                  >right place.</span
                >
              </h2>
            </div>
            <div class="col-lg-5">
              <p class="section-side-desc" data-reveal>
                Power when you need it. Calm when you don't. Every detail is
                designed to feel like it belongs.
              </p>
            </div>
          </div>
          <div class="bento-grid">
            <article class="bento-card workspace-bento" data-reveal>
              <div class="bento-text">
                <span class="feature-number">01 / YOUR SPACE</span>
                <h3>Tabs with<br />room to think.</h3>
                <p>
                  Keep your projects in order with workspaces, a collapsible
                  sidebar, and horizontal tabs when you want them.
                </p>
              </div>
              <div class="workspace-art">
                <div class="art-toolbar">
                  <span></span><span></span><span></span
                  ><small>Workspaces</small>
                </div>
                <div class="art-workspace active">
                  <i class="bi bi-circle-fill"></i> Personal <span>08</span>
                </div>
                <div class="art-workspace">
                  <i class="bi bi-briefcase"></i> Work <span>04</span>
                </div>
                <div class="art-workspace">
                  <i class="bi bi-stars"></i> Ideas <span>12</span>
                </div>
                <div class="art-tab-row">
                  <span>New tab</span><span>Research</span><span>↗</span>
                </div>
              </div>
              <span class="bento-corner"
                ><i class="bi bi-arrow-up-right"></i
              ></span>
            </article>
            <article class="bento-card privacy-bento" data-reveal>
              <div class="bento-text">
                <span class="feature-number">02 / STAY PRIVATE</span>
                <h3>Quietly<br />protective.</h3>
                <p>
                  Block common ad and tracker requests, with website location
                  access denied by default.
                </p>
              </div>
              <div class="privacy-art">
                <div class="privacy-glow"></div>
                <i class="bi bi-shield-lock-fill"></i>
                <div class="privacy-art-pill">
                  <i class="bi bi-check-circle-fill"></i> Location blocked
                </div>
              </div>
              <span class="bento-corner"
                ><i class="bi bi-arrow-up-right"></i
              ></span>
            </article>
            <article class="bento-card links-bento" data-reveal>
              <div class="bento-text">
                <span class="feature-number">03 / STAY CONNECTED</span>
                <h3>Pick up<br />anywhere.</h3>
                <p>
                  Share links using a QR code or send them to a paired device on
                  the same network.
                </p>
              </div>
              <div class="links-art">
                <div class="device-art-screen">
                  <img src="assets/img/aurora-pynault.webp" alt="" /><span
                    >PYNAULT</span
                  >
                </div>
                <div class="device-art-arrow">
                  <i class="bi bi-arrow-left-right"></i>
                </div>
                <div class="device-art-phone">
                  <img src="assets/img/aurora-pynault.webp" alt="" />
                </div>
              </div>
              <span class="bento-corner"
                ><i class="bi bi-arrow-up-right"></i
              ></span>
            </article>
          </div>
        </div>
      </section>

      <section class="privacy-section dark-section" id="privacy">
        <div class="privacy-ambient"></div>
        <div class="container-xxl">
          <div class="row align-items-end gy-4">
            <div class="col-lg-7">
              <div class="section-label section-label-dark" data-reveal>
                <span class="label-bullet"></span> PRIVACY IS PERSONAL
                <span>03 / 05</span>
              </div>
              <h2 class="display-heading dark-heading" data-reveal>
                Keep the web.<br /><span class="serif-word accent-serif"
                  >Lose the noise.</span
                >
              </h2>
            </div>
            <div class="col-lg-5">
              <p class="section-side-desc dark-description" data-reveal>
                Less unwanted clutter. More room to explore. Flip the switch
                below to see the idea behind Pynault's built-in privacy tools.
              </p>
            </div>
          </div>
          <div class="privacy-demo" data-reveal>
            <div class="demo-nav">
              <div class="demo-tabs">
                <button
                  type="button"
                  id="cleanBtn"
                  class="active"
                  aria-pressed="true"
                >
                  <i class="bi bi-shield-check"></i> With Pynault</button
                ><button type="button" id="clutterBtn" aria-pressed="false">
                  <i class="bi bi-window"></i> Without blocking
                </button>
              </div>
              <span
                >ILLUSTRATIVE EXAMPLE
                <i
                  class="bi bi-info-circle"
                  title="Illustration only, not a live benchmark"
                ></i
              ></span>
            </div>
            <div class="demo-browser">
              <div class="demo-browser-top">
                <span
                  ><i class="bi bi-circle-fill"></i
                  ><i class="bi bi-circle-fill"></i
                  ><i class="bi bi-circle-fill"></i
                ></span>
                <div><i class="bi bi-lock"></i> example.com/journal</div>
                <i class="bi bi-three-dots"></i>
              </div>
              <div class="demo-page">
                <div class="demo-magazine">
                  <div class="demo-magazine-label">
                    THE SUNDAY JOURNAL <small>IDEAS · CULTURE · DESIGN</small>
                  </div>
                  <div class="demo-photo"></div>
                  <div class="demo-magazine-copy">
                    <span>FIELD NOTES / NO. 024</span>
                    <h3>A little more room<br />for the things that matter.</h3>
                    <div class="fake-article-lines"><i></i><i></i><i></i></div>
                  </div>
                </div>
                <div class="demo-obstruction ad-one">
                  AD <i class="bi bi-x"></i
                  ><strong>Attention-grabbing popup!</strong
                  ><small>Something you didn't ask for.</small>
                </div>
                <div class="demo-obstruction ad-two">ADVERTISEMENT</div>
                <div class="demo-obstruction ad-three">
                  Cookies? Accept everything! <button>Accept</button>
                </div>
                <div class="clean-stamp">
                  <i class="bi bi-check-lg"></i> Fewer interruptions
                </div>
              </div>
            </div>
          </div>
          <div class="privacy-footer">
            <div>
              <span class="privacy-stat-icon"
                ><i class="bi bi-geo-alt"></i></span
              ><b>Location Guard</b
              ><small>Site location requests denied by default.</small>
            </div>
            <div>
              <span class="privacy-stat-icon"
                ><i class="bi bi-eye-slash"></i></span
              ><b>Ad & Tracker Blocker</b
              ><small>Built-in domain rules and page cleanup.</small>
            </div>
            <div>
              <span class="privacy-stat-icon"
                ><i class="bi bi-sliders"></i></span
              ><b>Your choice</b
              ><small>Change preferences in browser settings.</small>
            </div>
          </div>
        </div>
      </section>

      <section class="plugins-section light-section" id="features">
        <div class="container-xxl">
          <div class="row gy-4 align-items-end mb-5">
            <div class="col-lg-8">
              <div class="section-label" data-reveal>
                <span class="label-bullet"></span> LITTLE TOOLS. BIG DIFFERENCE.
                <span>04 / 05</span>
              </div>
              <h2 class="display-heading" data-reveal>
                Good things come<br /><span class="serif-word">built in.</span>
              </h2>
            </div>
            <div class="col-lg-4">
              <p class="section-side-desc" data-reveal>
                Helpful tools, right where you need them. No complicated setup
                just to make the web a little nicer.
              </p>
            </div>
          </div>
          <div class="plugin-grid">
            <div class="plugin-item" data-reveal>
              <div class="plugin-icon"><i class="bi bi-shield-shaded"></i></div>
              <span>01</span>
              <h3>Ad & Tracker Blocker</h3>
              <p>
                Filter common advertising and tracking domains with bundled
                protection.
              </p>
              <small>PRIVACY</small>
            </div>
            <div class="plugin-item" data-reveal>
              <div class="plugin-icon"><i class="bi bi-geo-alt"></i></div>
              <span>02</span>
              <h3>Location Guard</h3>
              <p>
                Don't let every website know where you are. Keep location
                requests off by default.
              </p>
              <small>PRIVACY</small>
            </div>
            <div class="plugin-item" data-reveal>
              <div class="plugin-icon"><i class="bi bi-qr-code-scan"></i></div>
              <span>03</span>
              <h3>QR Share</h3>
              <p>
                Turn a link into a scannable code to open it on another device.
              </p>
              <small>SHARING</small>
            </div>
            <div class="plugin-item" data-reveal>
              <div class="plugin-icon"><i class="bi bi-journal-text"></i></div>
              <span>04</span>
              <h3>Reader Mode</h3>
              <p>Trade visual clutter for a more comfortable way to read.</p>
              <small>FOCUS</small>
            </div>
            <div class="plugin-item" data-reveal>
              <div class="plugin-icon"><i class="bi bi-pencil-square"></i></div>
              <span>05</span>
              <h3>Page Notes</h3>
              <p>
                Jot down thoughts tied to the pages and ideas you're exploring.
              </p>
              <small>PRODUCTIVITY</small>
            </div>
            <div class="plugin-item" data-reveal>
              <div class="plugin-icon"><i class="bi bi-aspect-ratio"></i></div>
              <span>06</span>
              <h3>Focus & Screenshot</h3>
              <p>
                Reduce distractions and capture pages from the browser desktop.
              </p>
              <small>UTILITY</small>
            </div>
          </div>
          <p class="feature-footnote" data-reveal>
            First-party browser tools. Compatibility differs by platform.
            Third-party Chrome extension support is not included in the current
            development preview.
          </p>
        </div>
      </section>

      <section class="connected-section" id="connected">
        <div class="container-xxl">
          <div class="row align-items-center gy-5">
            <div class="col-lg-5">
              <div class="section-label section-label-dark" data-reveal>
                <span class="label-bullet"></span> YOUR WEB, EVERYWHERE
                <span>05 / 05</span>
              </div>
              <h2 class="display-heading dark-heading" data-reveal>
                One good idea.<br /><span class="serif-word accent-serif"
                  >Every screen.</span
                >
              </h2>
              <p class="connected-copy" data-reveal>
                That interesting article on your laptop? Open it on your phone
                in seconds. Generate a QR, scan it, and keep going. Paired
                devices on local Wi-Fi can also exchange encrypted links.
              </p>
              <div class="connected-steps" data-reveal>
                <div>
                  <span>01</span>
                  <p>Open a page on desktop.</p>
                </div>
                <div>
                  <span>02</span>
                  <p>Generate its QR code.</p>
                </div>
                <div>
                  <span>03</span>
                  <p>Scan with your phone and explore.</p>
                </div>
              </div>
              <a
                href="#download"
                class="btn-lime button-magnetic connected-button"
                >Find your download
                <span class="arrow-circle"
                  ><i class="bi bi-arrow-up-right"></i></span
              ></a>
            </div>
            <div class="col-lg-7">
              <div class="device-stage" data-reveal>
                <div class="stage-ring stage-ring-one"></div>
                <div class="stage-ring stage-ring-two"></div>
                <div class="stage-laptop">
                  <div class="stage-laptop-top">
                    <i class="bi bi-arrow-left"></i><span>pynault://newtab</span
                    ><i class="bi bi-three-dots"></i>
                  </div>
                  <div class="stage-laptop-main">
                    <img src="assets/img/pynault-mark.png" alt="" />
                    <h4>PYNAULT</h4>
                    <p>Browse Beyond.</p>
                    <div class="fake-search-bar">
                      <i class="bi bi-search"></i> Find your next idea
                    </div>
                  </div>
                </div>
                <div class="stage-qr-card">
                  <small
                    >OPEN ON MOBILE <i class="bi bi-arrow-up-right"></i></small
                  ><img
                    src="assets/img/demo-qr.png"
                    alt="Demonstration QR code linking to example.com"
                  /><span>Scan to try the handoff concept</span>
                </div>
                <div class="stage-phone">
                  <div class="stage-phone-island"></div>
                  <div class="stage-phone-image"></div>
                  <div class="stage-phone-logo">
                    <img src="assets/img/pynault-mark.png" alt="" /><strong
                      >PYNAULT</strong
                    >
                  </div>
                  <div class="stage-phone-search">
                    <i class="bi bi-search"></i> Search or enter URL
                  </div>
                  <div class="stage-phone-footer">
                    <i class="bi bi-arrow-left"></i><i class="bi bi-house"></i
                    ><i class="bi bi-app"></i><i class="bi bi-list"></i>
                  </div>
                </div>
                <div class="device-line" aria-hidden="true">
                  <svg viewBox="0 0 320 120" fill="none">
                    <path
                      d="M0 68 C100 -10 180 140 320 40"
                      stroke="#CFFF5D"
                      stroke-width="2"
                      stroke-dasharray="6 8"
                    />
                    <path
                      d="M306 34 L321 40 L310 56"
                      stroke="#CFFF5D"
                      stroke-width="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="download-section light-section" id="download">
        <div class="container-xxl">
          <div class="download-header text-center">
            <div class="section-label section-label-centered" data-reveal>
              <span class="label-bullet"></span> GET STARTED
              <span>READY WHEN YOU ARE</span>
            </div>
            <h2 class="display-heading" data-reveal>
              A better tab<br /><span class="serif-word">starts here.</span>
            </h2>
            <p data-reveal>
              Choose your platform. We'll recommend a download based on your
              device, but you're always in control.
            </p>
          </div>
          <div
            class="detected-banner"
            id="detectedBanner"
            role="status"
            data-reveal
          >
            <i class="bi bi-stars"></i>
            <div>
              <b id="detectedTitle">Finding your platform…</b
              ><span id="detectedHint"
                >Checking your browser's device type locally.</span
              >
            </div>
            <span class="detect-pill" id="detectPill">AUTO DETECT</span>
          </div>
          <div class="download-grid" id="downloadGrid">
            <div class="download-tile" data-platform="desktop" data-reveal>
              <div class="tile-top">
                <span>01 / DESKTOP</span><i class="bi bi-laptop"></i>
              </div>
              <h3>For your<br />big ideas.</h3>
              <p>
                Windows, macOS and Linux. Beautifully spacious browsing and
                flexible tabs.
              </p>
              <span class="platform-tag" id="desktopTag"
                >Windows · macOS · Linux</span
              ><button
                class="tile-download"
                type="button"
                data-download="desktop"
              >
                <span>Get for desktop</span><i class="bi bi-arrow-up-right"></i>
              </button>
            </div>
            <div class="download-tile" data-platform="android" data-reveal>
              <div class="tile-top">
                <span>02 / ANDROID</span><i class="bi bi-android"></i>
              </div>
              <h3>Take your<br />web with you.</h3>
              <p>
                Mobile-first navigation, browser tools and QR scanning in your
                pocket.
              </p>
              <span class="platform-tag">Android</span
              ><button
                class="tile-download"
                type="button"
                data-download="android"
              >
                <span>Get for Android</span><i class="bi bi-arrow-up-right"></i>
              </button>
            </div>
            <div class="download-tile" data-platform="ios" data-reveal>
              <div class="tile-top">
                <span>03 / IOS</span><i class="bi bi-apple"></i>
              </div>
              <h3>Feel at home<br />on iPhone.</h3>
              <p>
                A focused browser interface, convenient tabs and built-in
                website controls.
              </p>
              <span class="platform-tag">iPhone · iPad</span
              ><button class="tile-download" type="button" data-download="ios">
                <span>Get for iOS</span><i class="bi bi-arrow-up-right"></i>
              </button>
            </div>
          </div>
          <div class="source-link-row">
            <i class="bi bi-code-slash"></i
            ><span>Looking for the development source?</span
            ><a href="downloads/pynault-browser-v0.3-source.zip" download
              >Download source v0.3 <i class="bi bi-arrow-up-right"></i
            ></a>
          </div>
          <div class="download-disclaimer">
            Current browser builds are development previews. Platform installers
            are linked here only when an actual release file is configured and
            published.
          </div>
        </div>
      </section>

      <section class="faq-section light-section" id="faq">
        <div class="container-xxl">
          <div class="row gy-4">
            <div class="col-lg-5">
              <div class="section-label" data-reveal>
                <span class="label-bullet"></span> A FEW GOOD QUESTIONS
              </div>
              <h2 class="display-heading" data-reveal>
                Curious?<br /><span class="serif-word">Good.</span>
              </h2>
              <p class="faq-side" data-reveal>
                Here's what to know about Pynault, the current browser preview,
                and downloading it.
              </p>
            </div>
            <div class="col-lg-7">
              <div
                class="accordion accordion-flush pynault-accordion"
                id="faqAccordion"
              >
                <div class="accordion-item" data-reveal>
                  <h3 class="accordion-header">
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqOne"
                      aria-expanded="true"
                      aria-controls="faqOne"
                    >
                      Is Pynault available for desktop and mobile?
                    </button>
                  </h3>
                  <div
                    id="faqOne"
                    class="accordion-collapse collapse show"
                    data-bs-parent="#faqAccordion"
                  >
                    <div class="accordion-body">
                      Pynault has source implementations for Windows, macOS,
                      Linux, Android and iOS. Verified installers are not
                      included in the current development source package. This
                      landing page can link to platform downloads as soon as
                      those release files are published.
                    </div>
                  </div>
                </div>
                <div class="accordion-item" data-reveal>
                  <h3 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqTwo"
                      aria-expanded="false"
                      aria-controls="faqTwo"
                    >
                      Does Pynault block ads and website location requests?
                    </button>
                  </h3>
                  <div
                    id="faqTwo"
                    class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div class="accordion-body">
                      The development source includes bundled ad/tracker domain
                      rules, cosmetic cleanup, and Location Guard that denies
                      geolocation requests by default. Blocking is not
                      exhaustive and may vary by site or platform.
                    </div>
                  </div>
                </div>
                <div class="accordion-item" data-reveal>
                  <h3 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqThree"
                      aria-expanded="false"
                      aria-controls="faqThree"
                    >
                      Can I move a website from desktop to my phone?
                    </button>
                  </h3>
                  <div
                    id="faqThree"
                    class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div class="accordion-body">
                      Yes, the browser source implements QR-based website
                      sharing and local network device pairing. Scan a website
                      QR to open its link on mobile; the encrypted relay can
                      exchange links between paired devices on the same trusted
                      Wi-Fi.
                    </div>
                  </div>
                </div>
                <div class="accordion-item" data-reveal>
                  <h3 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqFour"
                      aria-expanded="false"
                      aria-controls="faqFour"
                    >
                      Can I install Chrome extensions?
                    </button>
                  </h3>
                  <div
                    id="faqFour"
                    class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div class="accordion-body">
                      Not as a general feature. Pynault currently has bundled
                      first-party browser tools. Its custom plugin registry does
                      not provide unrestricted Chrome Web Store extension
                      compatibility.
                    </div>
                  </div>
                </div>
                <div class="accordion-item" data-reveal>
                  <h3 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqFive"
                      aria-expanded="false"
                      aria-controls="faqFive"
                    >
                      How is the right download selected?
                    </button>
                  </h3>
                  <div
                    id="faqFive"
                    class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div class="accordion-body">
                      The site checks browser-provided operating-system signals
                      on your device. When it can identify your platform, it
                      highlights the most relevant option. If detection is
                      uncertain, all three options remain available. No
                      detection information is sent to a server.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="closing-section">
        <div class="closing-glow"></div>
        <div class="container-xxl closing-content">
          <span class="closing-eyebrow"
            >THE WORLD'S A BIG PLACE. KEEP EXPLORING.</span
          >
          <h2>See beyond<br />the <em>usual.</em></h2>
          <a class="closing-cta" href="#download"
            >Meet your new browser <span>↗</span></a
          >
          <div class="closing-logo">
            <img src="assets/img/pynault-mark.png" alt="" /><span>PYNAULT</span>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container-xxl">
        <div class="footer-main">
          <a class="brand footer-brand" href="#top"
            ><img src="assets/img/pynault-mark.png" alt="" /><span
              >pynault<span class="brand-period">.</span></span
            ></a
          >
          <p>Browse Beyond.<br />More web. Less noise.</p>
          <div class="footer-links">
            <a href="#experience">Experience</a><a href="#features">Features</a
            ><a href="#privacy">Privacy</a><a href="#connected">Connected</a
            ><a href="#download">Downloads</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span
            >© <span id="year">2026</span> Pynault. A browser in the
            making.</span
          ><span>Built with curiosity <i class="bi bi-arrow-up-right"></i></span
          ><a href="#top">BACK TO TOP <i class="bi bi-arrow-up"></i></a>
        </div>
      </div>
    </footer>

    <div
      class="modal fade"
      id="downloadModal"
      tabindex="-1"
      aria-labelledby="downloadModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <div class="modal-heading">
              <img src="assets/img/pynault-mark.png" alt="" /><span
                >PYNAULT / DOWNLOADS</span
              >
            </div>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="modal-glyph"><i class="bi bi-box-arrow-down"></i></div>
            <h2 id="downloadModalLabel">Release not published yet.</h2>
            <p id="downloadModalText">
              The build for this platform hasn't been uploaded. You can get the
              development source below.
            </p>
            <a
              href="downloads/pynault-browser-v0.3-source.zip"
              download
              class="modal-source-button"
              >Download source ZIP <i class="bi bi-arrow-down"></i></a
            ><small
              >Source code only — not an EXE, APK, IPA or App Store
              release.</small
            >
          </div>
        </div>
      </div>
    </div>
    <script src="assets/vendor/bootstrap.bundle.min.js" defer></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
      defer
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
      defer
    ></script>
    <script src="assets/js/detect.js" defer></script>
    <script src="assets/js/config.js" defer></script>
    <script src="assets/js/main.js" defer></script>
  </body>
</html>
