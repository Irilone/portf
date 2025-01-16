gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
let globalSplideInstance = null,
    openStorySection = null,
    projectData = [],
    fadeHeight = 100,
    carouselContainer = document.createElement("div");
async function fetchProjectData() {
    try {
        let e = await fetch("projects.json");
        if (!e.ok) throw Error(`Failed to fetch projects: ${e.statusText}`);
        let t = await e.json();
        return (projectData = t), populateProjectGrid(projectData), setupEventListeners(), t;
    } catch (i) {
        return console.error("Error fetching project data:", i), null;
    }
}

function getProjectDetails(e) {
    let t = projectData.find((t) => t.id === e);
    return t || (console.error(`Project details for ID ${e} not found.`), null);
}
async function showProjectStory(e) {
    console.log("Received project title:", e);
    try {
        let t = projectData.find((t) => t.title === e);
        if (!t) {
            console.error(`showProjectStory: Project details for ${e} not found.`);
            return;
        }
        if ((openStorySection && openStorySection.remove(), !t.stages)) {
            console.error("No stages defined for this project:", e);
            return;
        }
        let { storySection: i, splide: n } = buildProjectStory(t);
        document.body.appendChild(i),
            (openStorySection = i),
            gsap.to(i, { autoAlpha: 1, duration: 1 }),
            setTimeout(() => {
                let e = i.querySelector(".timeline-container"),
                    t;
                (t = window.innerWidth <= 768 ? e.offsetTop : e.offsetTop + e.offsetHeight / 2 - (window.visualViewport ? window.visualViewport.height : window.innerHeight) / 4), window.scrollTo({ top: t, behavior: "smooth" });
            }, 300),
            populateCarouselWithStageContent(t);
        let a = t.stages.findIndex((e) => "Challenge" === e.name);
        -1 !== a && (globalSplideInstance.go(a), updateActiveTimelineStage(a));
    } catch (o) {
        console.error("Error showing project story:", o);
    }
}
function populateProjectGrid(e) {
    let t = document.getElementById("projectGrid");
    t.innerHTML = e
        .map(
            (e) => `
        <div class="project-card"
            role="gridcell" 
            data-project-title="${e.title}" 
            onclick="showProjectStory('${e.title.replace(/'/g, "\\'")}')"
            aria-label="Project grid card, and button for ${e.title}"
            tabindex="0">
            <img src="${e.imageURL}" alt="Image of ${e.title}" class="img-fluid">
            <div class="project-card-body">
                <heading><h5 class="project-card-title">${e.title}</h5> </heading>
                <paragraph p class="project-card-text">${e.cardline}</p 
				paragraph>
            </div>
        </div>
    `
        )
        .join("");
}
function closeStory() {
    openStorySection && (gsap.killTweensOf(openStorySection), openStorySection.remove(), (openStorySection = null), ScrollTrigger.refresh());
}
function initScrollButtons(e, t, i) {
    let n = 1,
        a = e.querySelectorAll("h2#backgroundHeading, p"),
        o = (t) => {
            let i = a[t].offsetTop;
            gsap.to(e, { scrollTop: i, duration: 0.5 });
        };
    t.addEventListener("click", () => {
        n > 0 && o(--n);
    }),
        i.addEventListener("click", () => {
            n < a.length - 1 && o(++n);
        }),
        e.addEventListener("scroll", () => {
            n = e.scrollTop <= 10 ? 1 : n;
        });
}
function scrollAboutText(e) {
    let t = aboutText.scrollTop;
    gsap.to(aboutText, { scrollTop: t + ("up" === e ? -200 : 200), duration: 0.5 });
}
function createTimeline(e) {
    let t = document.createElement("div");
    t.className = "timeline-container";
    let i = document.createElement("div");
    (i.className = "project-title-container"), (i.innerHTML = `<h1 id="specProjectTitle">${e.title}</h1>`), t.appendChild(i);
    let n = "Synchronicity" === e.title,
        a = document.createElement("div");
    (a.className = n ? "specification-box sync-spec-box" : "specification-box"),
        (a.role = "contentinfo"),
        (a.ariaLabel = "Project details"),
        e.specifications.forEach((e) => {
            let t = document.createElement("div");
            (t.className = n ? "spec-column type sync-spec-item" : "spec-column type"), (t.innerHTML = `<h6>Type</h6><p>${e.Type}</p>`);
            let i = document.createElement("div");
            i.className = n ? "spec-column team sync-spec-item" : "spec-column team";
            let o = document.createElement("h6");
            (o.innerHTML = "Team"), i.appendChild(o);
            let l = document.createElement("div");
            (l.className = n ? "team-list two-columns" : "team-list"), populateTeamList(e.Team[0], l, n), i.appendChild(l);
            let r = document.createElement("div");
            (r.className = n ? "spec-column duration sync-spec-item" : "spec-column duration"), (r.innerHTML = `<h6>Duration</h6><p>${e.Duration}</p>`), a.appendChild(t), a.appendChild(i), a.appendChild(r);
        }),
        t.appendChild(a);
    let o = document.createElement("div");
    return (
        (o.className = "timelineTrack"),
        (o.role = "navigation"),
        t.appendChild(o),
        e.stages.forEach((e, t) => {
            let i = createTimelineStageElement(e, t);
            o.appendChild(i);
        }),
        t
    );
}
function populateTeamList(e, t, i) {
    if (i) {
        let n = document.createElement("ul"),
            a = document.createElement("ul");
        (n.className = "left"), (a.className = "right");
        let o = 0;
        Object.entries(e).forEach(([e, t]) => {
            let i = document.createElement("li");
            (i.textContent = t), (o % 2 == 0 ? n : a).appendChild(i), o++;
        }),
            t.appendChild(n),
            t.appendChild(a);
    } else {
        let l = document.createElement("ul");
        Object.entries(e).forEach(([e, t]) => {
            let i = document.createElement("li");
            (i.textContent = t), l.appendChild(i);
        }),
            t.appendChild(l);
    }
}
function createTimelineStageElement(e, t) {
    let i = document.createElement("div");
    return (
        (i.className = "timeline-stage"),
        i.setAttribute("tabindex", "0"),
        i.setAttribute("role", "button"),
        (i.textContent = e.name),
        (i.dataset.stageId = e.name),
        (i.dataset.slideIndex = t),
        i.addEventListener("focus", function () {
            this.style.outline = "5px dotted #e1e1e1;";
        }),
        i.addEventListener("click", function () {
            let e = parseInt(this.dataset.slideIndex, 10);
            globalSplideInstance.go(e), updateActiveTimelineStage(e);
        }),
        i.addEventListener("keydown", function (e) {
            ("Enter" === e.key || " " === e.key) && (e.preventDefault(), this.click());
        }),
        i
    );
}
function createSplide(e) {
    let t = document.createElement("div");
    return (
        (t.className = "splide solace-splide"),
        (t.innerHTML = `
	  <div class="splide__track">
		<ul class="splide__list"></ul>
	  </div>
	`),
        (globalSplideInstance = new Splide(t, {
            type: "slide",
            label: "Solace Carousel",
            labelledby: "projectCarousel",
            role: "main",
            speed: 400,
            rewindByDrag: !0,
            start: 0,
            perPage: 1,
            breakpoints: { 640: { perPage: 1, perMove: 1, gap: "1rem" } },
            perMove: 1,
            padding: { left: "0rem", right: "0rem" },
            arrows: !0,
            pagination: !1,
            drag: !0,
            noDrag: "input, textarea, .no-drag",
            dragMinThreshold: { mouse: 0, touch: 10 },
            flickPower: 100,
            snap: !0,
            flickMaxPages: 1,
            waitForTransition: !0,
            autoplay: !1,
            lazyLoad: "sequential",
            keyboard: !0,
            preloadPages: 3,
            direction: "ltr",
            focusableNodes: "",
            isNavigation: !1,
            live: "true",
            reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
            classes: { arrows: "splide__arrows your-class-arrows", arrow: "splide__arrow your-class-arrow", prev: "splide__arrow--prev your-class-prev", next: "splide__arrow--next your-class-next" },
            i18n: { prev: "Previous slide", next: "Next slide" },
        })).on("moved", (e) => {
            let t = document.querySelectorAll(".timeline-stage");
            t.forEach((t, i) => {
                let n = parseInt(t.dataset.slideIndex, 10);
                n === e ? t.classList.add("active") : t.classList.remove("active");
            });
        }),
        globalSplideInstance.mount(),
        t
    );
}
function buildProjectStory(e) {
    let t = document.createElement("section");
    (t.id = `story-${e.id}`), (t.className = "project-story");
    let i = createTimeline(e);
    t.appendChild(i);
    let n = createSplide(e);
    return t.appendChild(n), { storySection: t, splide: n };
}
function populateCarouselWithStageContent(e) {
    if (!globalSplideInstance) {
        console.error("Splide instance is not available.");
        return;
    }
    let t = globalSplideInstance.root.querySelector(".splide__list");
    (t.innerHTML = ""),
        e.stages.forEach((i) => {
            let n = '<div class="slide-grid-container">';
            (n += getStageContent(i, e.title)), (n += "</div>");
            let a = document.createElement("li");
            (a.className = "splide__slide"), (a.ariaDescription = "Project Carousel"), (a.innerHTML = n), t.appendChild(a);
        }),
        globalSplideInstance.refresh();
}
function getStageContent(e, t) {
    let i = "",
        n = "",
        a = '<div class="grid-row single-row" style="display: flex;">';
    return (
        Array.isArray(e.content)
            ? (e.content.forEach((o) => {
                  let l = "";
                  if ("Takeaways" === e.name) return (a += l = handleTakeawaysLayout(o));
                  switch (t) {
                      case "Papyrus":
                          (l = getPapyrusContent(o, e.name)), console.log("Solution stage content:", l);
                          break;
                      case "Solace":
                          l = getSolaceContent(o, e.name);
                          break;
                      case "SOS Alarm":
                          l = getSOSAlarmContent(o, e.name);
                          break;
                      case "Synchronicity":
                          l = getSynchronicityContent(o, e.name);
                          break;
                      case "SonArt":
                          l = getSonArtContent(o, e.name);
                          break;
                      default:
                          console.error("Unknown project:", t);
                  }
                  "text" !== o.type || Array.isArray(o.body) ? ("text" === o.type && Array.isArray(o.body) ? (n += l) : "image" === o.type ? (i += l) : "website-thumbnail" === o.type && (i += l)) : (i += l);
              }),
              "Takeaways" !== e.name && (a += `<div class="left-column">${i}</div><div class="right-column">${n}</div>`))
            : console.error("Expected an array of content for stage:", e.name),
        (a += "</div>")
    );
}
function getSOSAlarmContent(e, t) {
    let i = "";
    switch (e.type) {
        case "text":
            Array.isArray(e.body)
                ? ((i += `<div class="slide-text challenge-highlights text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <ul>`),
                  e.body.forEach((e) => {
                      Object.entries(e).forEach(([e, t]) => {
                          i += `<li><strong>${e}:</strong> ${t}</li>`;
                      });
                  }),
                  (i += `</ul>
                                </div>`))
                : (i += `<div class="slide-text text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <p>${e.body}</p>
                                </div>`);
            break;
        case "image":
            i += `
			<div class="slide-image-container" style="width: 100%; clear: both; margin-top: 20px;">
				<img src="${e.url}" alt="${e.description}" 
					 class="slide-image image-${e.id}" 
					 style="display: block; margin: auto;"
					 tabindex="0"
					 onclick="expandImage(this.src)"
					 onkeydown="handleKey(event, this.src)">
			</div>`;
    }
    return i;
}
function getSolaceContent(e, t) {
    let i = "";
    switch ((console.log("Item:", e, "Stage Name:", t), e.type)) {
        case "text":
            Array.isArray(e.body)
                ? ((i += `<div class="slide-text challenge-highlights text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <ul>`),
                  e.body.forEach((e) => {
                      Object.entries(e).forEach(([e, t]) => {
                          i += `<li><strong>${e}:</strong> ${t}</li>`;
                      });
                  }),
                  (i += `</ul>
                                </div>`))
                : (i += `<div class="slide-text text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <p>${e.body}</p>
                                </div>`);
            break;
        case "image":
            "Solution" !== t &&
                (i += `
			<div class="slide-image-container" style="width: 100%; clear: both; margin-top: 20px;">
				<img src="${e.url}" alt="${e.description}" 
					 class="slide-image image-${e.id}" 
					 style="display: block; margin: auto;"
					 tabindex="0"
					 onclick="expandImage(this.src)"
					 onkeydown="handleKey(event, this.src)">
			</div>`);
            break;
        case "website-thumbnail":
            "Solution" === t &&
                "website-thumbnail" === e.type &&
                (console.log("Creating thumbnail for:", e),
                (i += `<div class="slide-thumbnail-container" tabindex="0" 
			onclick="openModal('${e.url}')" 
			onkeydown="handleKey(event, '${e.url}')">
			<img src="${e.thumbnail}" alt="Thumbnail of ${e.description}" 
				class="slide-thumbnail image-${e.id}">
		</div>`));
    }
    return i;
}
function getSynchronicityContent(e, t) {
    let i = "";
    switch ((console.log("Item:", e, "Stage Name:", t), e.type)) {
        case "text":
            Array.isArray(e.body)
                ? ((i += `<div class="slide-text challenge-highlights text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <ul>`),
                  e.body.forEach((e) => {
                      Object.entries(e).forEach(([e, t]) => {
                          i += `<li><strong>${e}:</strong> ${t}</li>`;
                      });
                  }),
                  (i += `</ul>
                                </div>`))
                : (i += `<div class="slide-text text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <p>${e.body}</p>
                                </div>`);
            break;
        case "image":
            "Solution" !== t &&
                (i += `
			<div class="slide-image-container" style="width: 100%; clear: both; margin-top: 20px;">
				<img src="${e.url}" alt="${e.description}" 
					 class="slide-image image-${e.id}" 
					 style="display: block; margin: auto;"
					 tabindex="0"
					 onclick="expandImage(this.src)"
					 onkeydown="handleKey(event, this.src)">
			</div>`);
            break;
        case "website-thumbnail":
            "Solution" === t &&
                "website-thumbnail" === e.type &&
                (console.log("Creating thumbnail for:", e),
                (i += `<div class="slide-thumbnail-container" tabindex="0" 
			onclick="openModal('${e.url}')" 
			onkeydown="handleKey(event, '${e.url}')">
			<img src="${e.thumbnail}" alt="Thumbnail of ${e.description}" 
				class="slide-thumbnail image-${e.id}">
		</div>`));
    }
    return i;
}
function getSonArtContent(e, t) {
    let i = "";
    if ("Takeaways" === t) return handleTakeawaysLayout(e);
    switch (e.type) {
        case "text":
            Array.isArray(e.body)
                ? ((i += `<div class="slide-text challenge-highlights text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <ul>`),
                  e.body.forEach((e) => {
                      Object.entries(e).forEach(([e, t]) => {
                          i += `<li><strong>${e}:</strong> ${t}</li>`;
                      });
                  }),
                  (i += `</ul>
                                </div>`))
                : (i += `<div class="slide-text text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <p>${e.body}</p>
                                </div>`);
            break;
        case "image":
            i += `
		<div class="slide-image-container" style="width: 100%; clear: both; margin-top: 20px;">
			<img src="${e.url}" alt="${e.description}" 
				 class="slide-image image-${e.id}" 
				 style="display: block; margin: auto;"
				 tabindex="0"
				 onclick="expandImage(this.src)"
				 onkeydown="handleKey(event, this.src)">
		</div>`;
    }
    return i;
}
function getPapyrusContent(e, t) {
    let i = "";
    switch ((console.log("Item:", e, "Stage Name:", t), e.type)) {
        case "text":
            Array.isArray(e.body)
                ? ((i += `<div class="slide-text challenge-highlights text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <ul>`),
                  e.body.forEach((e) => {
                      Object.entries(e).forEach(([e, t]) => {
                          i += `<li><strong>${e}:</strong> ${t}</li>`;
                      });
                  }),
                  (i += `</ul>
                                </div>`))
                : (i += `<div class="slide-text text-${e.id}" style="margin-bottom: 20px;">
                                    <h2>${e.headline}</h2>
                                    <p>${e.body}</p>
                                </div>`);
            break;
        case "image":
            "Solution" !== t &&
                (i += `
			<div class="slide-image-container" style="width: 100%; clear: both; margin-top: 20px;">
				<img src="${e.url}" alt="${e.description}" 
					 class="slide-image image-${e.id}" 
					 style="display: block; margin: auto;"
					 tabindex="0"
					 onclick="expandImage(this.src)"
					 onkeydown="handleKey(event, this.src)">
			</div>`);
            break;
        case "website-thumbnail":
            "Solution" === t &&
                "website-thumbnail" === e.type &&
                (console.log("Creating thumbnail for:", e),
                (i += `<div class="slide-thumbnail-container" tabindex="0" 
			onclick="openModal('${e.url}')" 
			onkeydown="handleKey(event, '${e.url}')">
			<img src="${e.thumbnail}" alt="Thumbnail of ${e.description}" 
				class="slide-thumbnail image-${e.id}">
		</div>`));
    }
    return i;
}
function handleTakeawaysLayout(e) {
    if (!Array.isArray(e.body))
        return `<div class="takeaway-text">
                    <p>${e.body}</p>
                </div>`;
    {
        let t = Math.ceil(e.body.length / 2),
            i = "",
            n = "";
        return (
            e.body.forEach((e, a) => {
                let o = `<div class="slide-text challenge-highlights" style="margin-bottom: 20px;">
                                  <h2>${e.topic}</h2>
                                  <ul>
                                      <li><strong>Challenge:</strong> ${e.challenge}</li>
                                      <li><strong>Solution:</strong> ${e.solution}</li>
                                      <li><strong>Impact:</strong> ${e.impact}</li>
                                  </ul>
                              </div>`;
                a < t ? (i += o) : (n += o);
            }),
            `<div class="left-column">${i}</div><div class="right-column">${n}</div>`
        );
    }
}
function loadProjectByName(e) {
    let t = projectData.find((t) => t.title === e);
    t ? populateCarouselWithStageContent(t) : (console.error("Project not found:", e), console.log(projectData));
}
function createModalIfNeeded() {
    document.getElementById("websiteModal") || createModal();
}
function createModal() {
    let e = document.createElement("div");
    (e.id = "websiteModal"),
        (e.className = "modal"),
        (e.style.display = "none"),
        (e.innerHTML = `
		<div class="modal-content">
			<span class="close" tabindex="0"
				onclick="closeModal()"
				onkeydown="closeModal()">&times;</span>
			<iframe id="websiteFrame" name="websiteFrame" frameborder="0"></iframe>
        </div>
    `),
        document.body.appendChild(e);
}
function openModal(e) {
    var t = document.getElementById("websiteModal");
    t || (createModal(), (t = document.getElementById("websiteModal"))), (t.querySelector("iframe").src = e), (t.style.display = "block");
}
function closeModal() {
    document.getElementById("websiteModal").remove(), (document.getElementById("websiteFrame").src = "");
}
function expandImage(e) {
    if (document.querySelector(".image-modal")) return;
    let t = document.createElement("div");
    (t.className = "image-modal"),
        (t.style.position = "fixed"),
        (t.style.left = "0"),
        (t.style.top = "0"),
        (t.style.width = "100%"),
        (t.style.height = "100%"),
        (t.style.backgroundColor = "rgba(0,0,0,0.8)"),
        (t.style.display = "flex"),
        (t.style.justifyContent = "center"),
        (t.style.alignItems = "center"),
        (t.style.cursor = "pointer"),
        (t.style.zIndex = "1000"),
        (t.innerHTML = `<img src="${e}" style="max-width:90%; max-height:90%; border: 1px solid white; border-radius:10px;">`),
        (t.onclick = function () {
            document.body.removeChild(this);
        }),
        (t.oknkeydown = function () {
            document.body.removeChild(this);
        }),
        document.body.appendChild(t);
}
function updateActiveTimelineStage(e) {
    let t = document.querySelectorAll(".timeline-stage");
    t.forEach((t, i) => {
        i === e ? t.classList.add("active") : t.classList.remove("active");
    });
}
function setupEventListeners() {
    document.querySelectorAll(".project-card").forEach((e) => {
        e.addEventListener("click", function () {
            let e = this.dataset.projectTitle;
            e ? showProjectStory(e) : console.error("No project title available");
        }),
            e.addEventListener("keydown", function (e) {
                ("Enter" === e.key || " " === e.key) && (e.preventDefault(), this.click());
            });
    });
}
function setupNavigationEventListeners() {
    document.getElementById("projectsLink").addEventListener("click", (e) => {
        e.preventDefault(), switchContent("presentationContent");
    }),
        document.getElementById("aboutLink").addEventListener("click", (e) => {
            e.preventDefault(), switchContent("aboutContent");
        });
}
function updateNavLinks(e) {
    let t = document.querySelectorAll(".nav-link");
    t.forEach((t) => {
        t.id === e ? (t.classList.add("active"), console.log("Active added", t.id), (t.style.color = "#000")) : (t.classList.remove("active"), console.log("Active removed", t.id), (t.style.color = "rgb(106, 106, 106)"));
    });
}
function closeImage() {
    document.querySelectorAll(".image-modal").forEach(function (e) {
        e.parentNode.removeChild(e);
    });
}
function handleKey(e, t) {
    "Enter" === e.key ? (expandImage(t), openModal(t)) : "Escape" === e.key && (closeImage(), closeModal());
}
function switchContent(e, t) {
    console.log("Current openStorySection switchContent:", t), console.log("Switching content to: ", e);
    let i = document.getElementById("presentation"),
        n = document.getElementById("aboutContent"),
        a = document.getElementById("gridContainer"),
        o = document.getElementById("projectGrid"),
        l = document.getElementById("presentationContent"),
        r;
    if (("aboutContent" === e ? ((r = [n]), closeStory()) : (r = [i, l, a, o]), "presentationContent" === e)) {
        c(!0);
        let s = () => {
            c(!1), window.removeEventListener("scroll", s);
        };
        window.addEventListener("scroll", s);
    } else c(!1);
    function c(e) {
        let t = document.getElementById("gridContainer");
        e ? t.classList.add("forced-opacity") : (t.classList.remove("forced-opacity"), t.classList.add("forced-visibility"));
    }
    [i, l, a, o, n].forEach((e) => {
        r.includes(e) ||
            gsap.to(e, {
                opacity: 0,
                duration: 0.5,
                onComplete() {
                    var t;
                    (e.style.display = "none"),
                        (e.style.visibility = "hidden"),
                        (t = r),
                        gsap.set(t, {
                            display: function (e, t) {
                                return t === n ? "flex" : "";
                            },
                            visibility: "visible",
                        }),
                        gsap.to(t, {
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.1,
                            ease: "power2.inOut",
                            onStart: function () {
                                this.targets().forEach((e) => {
                                    e.style.display = e === n ? "flex" : "";
                                });
                            },
                            onComplete: function () {},
                        });
                },
            });
    }),
        updateNavLinks("aboutContent" === e ? "aboutLink" : "projectsLink"),
        gsap.delayedCall(0.6, function () {
            ScrollTrigger.refresh();
        });
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
(carouselContainer.className = "splide"),
    (carouselContainer.innerHTML = `
  <div class="splide__track">
	<ul class="splide__list"></ul>
  </div>
`),
    document.addEventListener("DOMContentLoaded", function () {
        for (var e = document.getElementsByTagName("link"), t = 0; t < e.length; t++) "https://fonts.googleapis.com/css?family=Lato" === e[t].href && (e[t].disabled = !0);
    }),
document.addEventListener("DOMContentLoaded", async () => {
    try {
        projectData = await fetchProjectData();
        if (projectData) {
            populateProjectGrid(projectData);
            setupEventListeners();
        }
    } catch (e) {
        console.error("Error during initialization:", e);
    }
    let aboutText = document.getElementById("aboutText"),
        scrollUp = document.getElementById("scrollUp"),
        scrollDown = document.getElementById("scrollDown");
    initScrollButtons(aboutText, scrollUp, scrollDown);
    setupNavigationEventListeners();
    initProjectGridOpacityAnimation();
});

function initProjectGridOpacityAnimation(){gsap.fromTo("#gridContainer",{opacity:0.1},{opacity:1,scrollTrigger:{trigger:"#gridContainer",start:"top bottom",endTrigger:".project-card",end:"bottom center",scrub:true}});}


function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
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

function getTotalOffsetTop(elem) {
    var offsetTop = 0;
    while (elem) {
        offsetTop += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return offsetTop;
}
document.addEventListener("DOMContentLoaded", function () {
    var gridContainer = document.getElementById("gridContainer");
    document.getElementById("projectsLink").addEventListener("click", function (event) {
        event.preventDefault();
        var targetElement, targetPosition;
        if (gridContainer) {
            var headingElement = document.querySelectorAll("h1")[1];
            targetElement = window.innerWidth <= 768 ? headingElement : gridContainer;
            targetPosition = getTotalOffsetTop(targetElement) + (window.innerWidth <= 768 ? 0 : gridContainer.offsetHeight / 3 - (window.visualViewport ? window.visualViewport.height : window.innerHeight) / 2);
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
            console.log("Scroll completed to:", targetPosition);
        }
    });
}),
    document.addEventListener("DOMContentLoaded", function () {
        var aboutLink = document.getElementById("aboutLink");
        aboutLink.addEventListener("click", function (event) {
            event.preventDefault();
            var aboutContent = document.getElementById("aboutContent");
            if (aboutContent) {
                var backgroundHeading = document.getElementById("backgroundHeading");
                var aboutText = document.getElementById("aboutText");
                var targetPosition;
                if (backgroundHeading && aboutText) {
                    targetPosition =
                        window.innerWidth <= 768 ? getTotalOffsetTop(backgroundHeading) : getTotalOffsetTop(aboutText) + aboutText.offsetHeight / 3 - (window.visualViewport ? window.visualViewport.height : window.innerHeight) / 2;
                    window.scrollTo({ top: targetPosition, behavior: "smooth" });
                    console.log("Target Y Calculated as:", targetPosition);
                    switchContent("aboutContent");
                    if (typeof openStorySection !== "undefined" && openStorySection) {
                        let iframe = openStorySection.querySelector("iframe");
                        if (iframe) {
                            console.log("Found an iframe, attempting to mute:", iframe);
                            iframe.src = "about:blank";
                            iframe.remove();
                        } else {
                            console.log("No iframe found within openStorySection:", openStorySection);
                        }
                        openStorySection = null;
                    }
                } else {
                    console.error("Background heading or About text not found!");
                }
            }
        });
    });
