
/* =========================================
   THE BRIEFLINE - MAIN JAVASCRIPT
   Tailwind CSS News Website
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------------
  // 1. DATE AND COPYRIGHT YEAR
  // -------------------------------------

  const dateElement = document.getElementById("currentDate");

  if (dateElement) {
    dateElement.textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date());
  }

  document.querySelectorAll(".currentYear").forEach(element => {
    element.textContent = new Date().getFullYear();
  });


  // -------------------------------------
  // 2. NAVIGATION ACTIVE STATE
  // -------------------------------------

  const currentPage = document.body.dataset.page;

  document.querySelectorAll(".nav-link").forEach(link => {

    link.classList.add(
      "text-muted",
      "text-xs",
      "font-bold",
      "py-4",
      "transition-colors",
      "hover:text-accent"
    );

    const linkPage = link.getAttribute("href");

    let isActive = false;

    if (currentPage === "home" && linkPage === "index.html") {
      isActive = true;
    }

    if (currentPage === "world" && linkPage === "world.html") {
      isActive = true;
    }

    if (currentPage === "technology" && linkPage === "technology.html") {
      isActive = true;
    }

    if (currentPage === "sports" && linkPage === "sports.html") {
      isActive = true;
    }

    if (isActive) {
      link.classList.remove("text-muted");
      link.classList.add("text-accent");
    }
  });


  // -------------------------------------
  // 3. MOBILE NAVIGATION
  // -------------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

      const isOpening = navMenu.classList.contains("hidden");

      navMenu.classList.toggle("hidden");
      menuToggle.textContent = isOpening ? "✕" : "☰";

      if (isOpening) {
        navMenu.classList.add(
          "flex",
          "flex-col",
          "items-start",
          "gap-3",
          "py-5"
        );
      } else {
        navMenu.classList.remove(
          "flex",
          "flex-col",
          "items-start",
          "gap-3",
          "py-5"
        );
      }
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
          navMenu.classList.add("hidden");
          navMenu.classList.remove(
            "flex",
            "flex-col",
            "items-start",
            "gap-3",
            "py-5"
          );
          menuToggle.textContent = "☰";
        }
      });
    });
  }


  // -------------------------------------
  // 4. SEARCH PANEL
  // -------------------------------------

  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const searchInput = document.getElementById("searchInput");

  if (searchToggle && searchPanel) {

    searchToggle.addEventListener("click", () => {

      searchPanel.classList.toggle("hidden");

      if (!searchPanel.classList.contains("hidden")) {
        searchInput?.focus();
      } else if (searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
      }
    });
  }


  // -------------------------------------
  // 5. LIVE STORY SEARCH
  // -------------------------------------

  if (searchInput) {

    searchInput.addEventListener("input", () => {

      const query = searchInput.value
        .trim()
        .toLowerCase();

      const cards = Array.from(
        document.querySelectorAll(".story-card[data-search]")
      );

      let visibleCount = 0;

      cards.forEach(card => {

        const searchableText = (
          card.dataset.search + " " + card.textContent
        ).toLowerCase();

        const matches = searchableText.includes(query);

        card.classList.toggle("hidden", !matches);

        if (matches) {
          visibleCount++;
        }
      });

      let message = document.getElementById("searchEmpty");

      if (!message && cards.length) {

        message = document.createElement("div");

        message.id = "searchEmpty";
        message.className =
          "col-span-full text-center py-14 text-muted border border-stone-200 dark:border-stone-700";

        message.textContent =
          "No stories found. Try another search.";

        const parent = cards[0].parentElement;

        if (parent) {
          parent.appendChild(message);
        }
      }

      if (message) {
        message.classList.toggle(
          "hidden",
          query === "" || visibleCount > 0
        );
      }
    });
  }


  // -------------------------------------
  // 6. DARK / LIGHT MODE
  // -------------------------------------

  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  const savedTheme = localStorage.getItem("briefline-theme");

  if (savedTheme === "dark") {
    root.classList.add("dark");
  }

  function updateThemeIcon() {

    if (!themeToggle) return;

    themeToggle.textContent =
      root.classList.contains("dark") ? "☀" : "☾";
  }

  updateThemeIcon();

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      root.classList.toggle("dark");

      const darkEnabled = root.classList.contains("dark");

      localStorage.setItem(
        "briefline-theme",
        darkEnabled ? "dark" : "light"
      );

      updateThemeIcon();
    });
  }


  // -------------------------------------
  // 7. BOOKMARK SYSTEM
  // -------------------------------------

  const BOOKMARK_KEY = "briefline-bookmarks";

  function getBookmarks() {

    try {
      return JSON.parse(
        localStorage.getItem(BOOKMARK_KEY) || "[]"
      );
    } catch (error) {
      return [];
    }
  }

  function updateBookmarkButtons() {

    const bookmarks = getBookmarks();

    document.querySelectorAll("[data-save]").forEach(button => {

      const saved = bookmarks.includes(button.dataset.save);

      button.classList.toggle("text-accent", saved);
      button.classList.toggle("font-bold", saved);

      button.setAttribute("aria-pressed", String(saved));

      if (button.classList.contains("bookmark-btn")) {

        if (button.closest("article") ||
          button.closest("section")) {

          button.textContent = saved ? "♥" : "♡";
        }

        if (button.closest(".article-heading")) {
          button.textContent = saved ? "♥ Saved" : "♡ Save";
        }
      }
    });
  }

  document.querySelectorAll("[data-save]").forEach(button => {

    button.addEventListener("click", () => {

      const id = button.dataset.save;

      if (!id) return;

      let bookmarks = getBookmarks();

      if (bookmarks.includes(id)) {

        bookmarks = bookmarks.filter(
          item => item !== id
        );

      } else {

        bookmarks.push(id);
      }

      localStorage.setItem(
        BOOKMARK_KEY,
        JSON.stringify(bookmarks)
      );

      updateBookmarkButtons();
    });
  });

  updateBookmarkButtons();


  // -------------------------------------
  // 8. NEWSLETTER SUBSCRIPTION DEMO
  // -------------------------------------

  document.querySelectorAll(".newsletter-form").forEach(form => {

    form.addEventListener("submit", event => {

      event.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const message = form.querySelector(".form-message");

      if (!emailInput || !message) return;

      const email = emailInput.value.trim().toLowerCase();

      if (!email || !emailInput.checkValidity()) {
        message.textContent = "Please enter a valid email address.";
        return;
      }

      let subscribers = [];

      try {
        subscribers = JSON.parse(
          localStorage.getItem("briefline-subscribers") || "[]"
        );
      } catch (error) {
        subscribers = [];
      }

      if (subscribers.includes(email)) {

        message.textContent = "You are already subscribed!";

        return;
      }

      subscribers.push(email);

      localStorage.setItem(
        "briefline-subscribers",
        JSON.stringify(subscribers)
      );

      message.textContent =
        "Thank you! Your subscription has been saved.";

      form.reset();
    });
  });


  // -------------------------------------
  // 9. ARTICLE DATABASE
  // -------------------------------------

  const articles = {

    "global-shift": {
      category: "WORLD NEWS",
      title: "A Changing World: The Stories Shaping Tomorrow",
      subtitle: "From international cooperation to technological innovation, explore the developments influencing our shared future.",
      author: "Briefline Editorial Desk",
      date: "November 12, 2026",
      read: "6 min read",
      image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative editorial image",
      sections: [
        {
          heading: "A World of New Possibilities",
          text: "Today's global landscape is shaped by innovation, economic transformation and social change. Communities, businesses and governments are finding new ways to respond to a rapidly evolving environment."
        },
        {
          heading: "The Importance of Global Cooperation",
          text: "Many of the major challenges facing society require communication and cooperation. Environmental protection, education, economic development and technological progress all benefit from the exchange of knowledge and ideas."
        },
        {
          heading: "Understanding the Changes",
          text: "Technology has become an important part of this transformation. Digital communication and modern infrastructure are creating new opportunities for people to connect across borders."
        },
        {
          heading: "Looking Ahead",
          text: "Education, creativity, responsible innovation and informed public discussion can help communities prepare for the future. Understanding the world begins with understanding the stories behind it."
        }
      ]
    },

    "ai-tools": {
      category: "TECHNOLOGY",
      title: "How AI Is Opening New Doors for Human Creativity",
      subtitle: "Artificial intelligence is creating new ways for people to explore ideas, solve problems and express creativity.",
      author: "Technology Desk",
      date: "November 12, 2026",
      read: "5 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative image representing artificial intelligence",
      sections: [
        {
          heading: "A New Creative Landscape",
          text: "Artificial intelligence tools are becoming part of creative workflows. Designers, developers, researchers and writers can use these technologies to explore concepts and experiment with different approaches."
        },
        {
          heading: "People and Technology",
          text: "The most meaningful results often come from combining human judgement with technological assistance. Understanding context, making decisions and communicating ideas remain essential human skills."
        },
        {
          heading: "The Challenges Ahead",
          text: "Responsible use, privacy, accuracy and transparency remain important discussions as these tools become more widely available."
        },
        {
          heading: "What Comes Next",
          text: "The future of creative technology will depend on how people learn to use new tools thoughtfully. Curiosity and critical thinking will continue to matter."
        }
      ]
    },

    "climate-action": {
      category: "ENVIRONMENT",
      title: "The Search for a More Sustainable Future",
      subtitle: "Communities are exploring new ideas to protect nature and build a more responsible relationship with the environment.",
      author: "Environment Desk",
      date: "November 10, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative environmental image",
      sections: [
        {
          heading: "A Shared Responsibility",
          text: "Environmental sustainability is influenced by the choices of individuals, businesses and institutions. Practical solutions can make communities more resilient and resource conscious."
        },
        {
          heading: "Small Changes, Bigger Impact",
          text: "Responsible consumption, waste reduction, efficient energy use and protection of green spaces are examples of actions that can contribute to a sustainable lifestyle."
        },
        {
          heading: "Working Together",
          text: "Communities can learn from one another, share successful ideas and create projects suited to local needs."
        }
      ]
    },

    "athlete-generation": {
      category: "SPORTS",
      title: "A New Generation Is Changing the World of Sports",
      subtitle: "New training methods, determination and changing fan experiences are bringing fresh energy to competitive sports.",
      author: "Sports Desk",
      date: "November 12, 2026",
      read: "5 min read",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative sports image",
      sections: [
        {
          heading: "A New Sporting Generation",
          text: "Young athletes are bringing new approaches to preparation, performance and competition. Their journeys reflect the importance of discipline, opportunity and support."
        },
        {
          heading: "Training Is Evolving",
          text: "Modern sports combine physical preparation with careful planning, performance analysis and recovery. Coaches and athletes continue to explore ways to develop their abilities."
        },
        {
          heading: "The Importance of Community",
          text: "Fans, local clubs, families and mentors all play an important role in creating opportunities for athletes and keeping sporting communities connected."
        }
      ]
    },

    "future-cities": {
      category: "BUSINESS & CITIES",
      title: "How Cities Are Preparing for a Changing Economy",
      subtitle: "Urban development, business innovation and infrastructure are influencing the future of modern cities.",
      author: "Business Desk",
      date: "November 08, 2026",
      read: "5 min read",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative modern city image",
      sections: [
        {
          heading: "The Changing Urban Landscape",
          text: "Cities are constantly adapting to new economic needs, changing populations and evolving ways of working."
        },
        {
          heading: "Innovation and Infrastructure",
          text: "Modern transport, digital services and well-designed public spaces can help make urban communities more accessible and efficient."
        },
        {
          heading: "Planning for Tomorrow",
          text: "Long-term planning requires collaboration between residents, businesses, public institutions and urban designers."
        }
      ]
    },

    "future-work": {
      category: "EDUCATION & WORK",
      title: "The Changing Future of Remote Work and Collaboration",
      subtitle: "Digital platforms and changing workplace habits are creating new ways for teams to communicate and work together.",
      author: "Technology Desk",
      date: "November 11, 2026",
      read: "5 min read",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative workplace image",
      sections: [
        {
          heading: "Work Without Borders",
          text: "Digital collaboration tools make it possible for people in different locations to exchange ideas and coordinate their work."
        },
        {
          heading: "Building Better Teams",
          text: "Communication, shared expectations and clear responsibilities help distributed teams work effectively."
        },
        {
          heading: "A More Flexible Future",
          text: "The future of work will continue to evolve as organisations explore different ways to balance productivity, creativity and workplace wellbeing."
        }
      ]
    },

    "world-diplomacy": {
      category: "WORLD NEWS",
      title: "Global Leaders Explore New Ways to Work Together",
      subtitle: "International discussions continue to highlight the importance of cooperation, communication and shared priorities.",
      author: "Global Desk",
      date: "November 12, 2026",
      read: "5 min read",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative international meeting image",
      sections: [
        {
          heading: "Dialogue and Cooperation",
          text: "International relationships depend on communication, mutual understanding and practical solutions to shared challenges."
        },
        {
          heading: "A Changing Global Environment",
          text: "Economic priorities, technological development and environmental concerns are among the subjects shaping international conversations."
        },
        {
          heading: "The Value of Partnership",
          text: "Constructive partnerships can support knowledge exchange and help institutions respond to complex issues."
        }
      ]
    },

    "world-economy": {
      category: "WORLD ECONOMY",
      title: "Understanding the Forces Reshaping Global Markets",
      subtitle: "Changing consumer habits, technology and business strategies are influencing the modern global economy.",
      author: "Business Desk",
      date: "November 09, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative financial image",
      sections: [
        {
          heading: "Markets in Transition",
          text: "Businesses continually adapt to consumer expectations, new technology and changing economic conditions."
        },
        {
          heading: "Opportunities for Entrepreneurs",
          text: "Innovation, research and an understanding of customer needs can help businesses identify areas for growth."
        },
        {
          heading: "A Global Perspective",
          text: "Trade, investment and digital communication connect markets and create opportunities for collaboration."
        }
      ]
    },

    "world-travel": {
      category: "TRAVEL",
      title: "The Destinations Inspiring a New Generation",
      subtitle: "Travel experiences are evolving as more people look for meaningful ways to discover new places and cultures.",
      author: "Features Desk",
      date: "November 08, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative travel image",
      sections: [
        {
          heading: "Discovering New Places",
          text: "Travel offers opportunities to experience different landscapes, traditions and communities."
        },
        {
          heading: "A Responsible Approach",
          text: "Respect for local culture, natural environments and community needs can make travel experiences more sustainable."
        },
        {
          heading: "The Joy of Exploration",
          text: "Curiosity and thoughtful planning can turn a journey into a valuable learning experience."
        }
      ]
    },

    "global-communities": {
      category: "SOCIETY",
      title: "Digital Connections Are Bringing People Closer",
      subtitle: "Communication platforms are creating new ways for people to share knowledge, ideas and experiences.",
      author: "Society Desk",
      date: "November 07, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative digital communication image",
      sections: [
        {
          heading: "Communities in a Connected World",
          text: "Digital communication allows people to maintain relationships and exchange information across long distances."
        },
        {
          heading: "Sharing Knowledge",
          text: "Online communities can help people learn new skills, discuss ideas and find useful resources."
        },
        {
          heading: "Using Technology Thoughtfully",
          text: "Respectful communication, privacy awareness and critical thinking remain essential parts of digital participation."
        }
      ]
    },

    "gaming-tech": {
      category: "GAMING",
      title: "How Gaming Technology Continues to Push Creative Limits",
      subtitle: "Interactive entertainment continues to develop through new experiences, creative design and evolving technology.",
      author: "Technology Desk",
      date: "November 10, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative gaming image",
      sections: [
        {
          heading: "An Interactive Medium",
          text: "Games combine storytelling, design, sound and technology to create interactive experiences."
        },
        {
          heading: "Creative Possibilities",
          text: "Developers continue to experiment with new mechanics, visual ideas and ways to connect players."
        },
        {
          heading: "The Community Experience",
          text: "Gaming communities share experiences, creative work and knowledge across different platforms."
        }
      ]
    },

    "digital-life": {
      category: "DIGITAL LIFE",
      title: "Building Better Digital Habits in a Connected World",
      subtitle: "Thoughtful digital habits can help people balance connectivity, productivity and everyday life.",
      author: "Technology Desk",
      date: "November 09, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative digital lifestyle image",
      sections: [
        {
          heading: "Living with Technology",
          text: "Digital devices are part of modern communication, education and work. Using them thoughtfully can support everyday activities."
        },
        {
          heading: "Creating Healthy Habits",
          text: "Organising notifications, taking regular breaks and protecting time for offline activities can help people develop a more balanced routine."
        },
        {
          heading: "Making Technology Work for You",
          text: "The goal is not simply to use more technology, but to use the right tools in ways that support meaningful goals."
        }
      ]
    },

    "space-exploration": {
      category: "SPACE & SCIENCE",
      title: "The Future of Space Exploration and Discovery",
      subtitle: "Scientific curiosity continues to expand our understanding of space, the universe and our place within it.",
      author: "Science Desk",
      date: "November 08, 2026",
      read: "5 min read",
      image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative space image",
      sections: [
        {
          heading: "Exploring the Unknown",
          text: "Space science brings together research, engineering and curiosity to investigate questions beyond our planet."
        },
        {
          heading: "The Value of Research",
          text: "Scientific exploration can develop new technologies and create knowledge that benefits wider society."
        },
        {
          heading: "A Continuing Journey",
          text: "Future discoveries will depend on careful research, international collaboration and sustained curiosity."
        }
      ]
    },

    "digital-learning": {
      category: "EDUCATION",
      title: "How Digital Learning Is Changing Education",
      subtitle: "Online resources and digital platforms are creating different opportunities for students, teachers and lifelong learners.",
      author: "Education Desk",
      date: "November 07, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative digital education image",
      sections: [
        {
          heading: "Learning Beyond the Classroom",
          text: "Digital resources allow learners to access educational material at different times and from different places."
        },
        {
          heading: "The Role of Teachers",
          text: "Teachers continue to play a central role in guiding learners, explaining concepts and encouraging critical thinking."
        },
        {
          heading: "Learning for Life",
          text: "Flexible learning opportunities can help people build new skills throughout their lives."
        }
      ]
    },

    "basketball": {
      category: "BASKETBALL",
      title: "The Skills and Strategies Behind Modern Basketball",
      subtitle: "Teamwork, preparation and adaptability remain important parts of competitive basketball.",
      author: "Sports Desk",
      date: "November 11, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative basketball image",
      sections: [
        {
          heading: "More Than Individual Skill",
          text: "Basketball depends on communication, positioning and the ability to make decisions as a team."
        },
        {
          heading: "Preparation and Performance",
          text: "Regular training helps players develop technical skills, fitness and an understanding of the game."
        },
        {
          heading: "A Global Sport",
          text: "Basketball continues to connect players and supporters through local communities and international competition."
        }
      ]
    },

    "football-global": {
      category: "FOOTBALL",
      title: "Football's Global Community Continues to Grow",
      subtitle: "Local clubs, international tournaments and passionate supporters continue to connect football communities.",
      author: "Sports Desk",
      date: "November 10, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative football image",
      sections: [
        {
          heading: "A Sport That Crosses Borders",
          text: "Football creates shared experiences for supporters from different countries and backgrounds."
        },
        {
          heading: "The Importance of Local Clubs",
          text: "Local teams and community programmes can introduce new generations to the sport."
        },
        {
          heading: "The Global Game",
          text: "International competitions and digital coverage make football accessible to audiences worldwide."
        }
      ]
    },

    "cricket-culture": {
      category: "CRICKET",
      title: "Cricket Continues to Unite Fans Across Generations",
      subtitle: "The traditions and changing formats of cricket continue to attract audiences across different communities.",
      author: "Sports Desk",
      date: "November 09, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative cricket image",
      sections: [
        {
          heading: "A Game with a Rich Tradition",
          text: "Cricket has developed a strong culture of competition, teamwork and shared experiences among its supporters."
        },
        {
          heading: "Changing Formats",
          text: "Different match formats allow the sport to reach audiences with different interests and viewing habits."
        },
        {
          heading: "The Next Generation",
          text: "Community cricket, youth programmes and accessible facilities can help introduce new players to the game."
        }
      ]
    },

    "sports-recovery": {
      category: "FITNESS",
      title: "Why Recovery Is an Essential Part of Athletic Training",
      subtitle: "Rest, preparation and consistent habits play important roles in athletic development.",
      author: "Sports Desk",
      date: "November 08, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative fitness image",
      sections: [
        {
          heading: "Training Beyond Exercise",
          text: "Athletic development involves more than physical activity. Preparation, rest and regular evaluation are also important."
        },
        {
          heading: "Consistency Matters",
          text: "Balanced routines and appropriate recovery can support long-term training goals."
        },
        {
          heading: "A Thoughtful Approach",
          text: "Athletes and coaches can benefit from understanding individual needs and planning training responsibly."
        }
      ]
    },

    "community-sports": {
      category: "COMMUNITY SPORTS",
      title: "Community Sports Programs Help Young People Thrive",
      subtitle: "Accessible local sports programmes can create opportunities for young people to develop skills and confidence.",
      author: "Sports Desk",
      date: "November 07, 2026",
      read: "4 min read",
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1500&q=85",
      caption: "Illustrative community sports image",
      sections: [
        {
          heading: "Creating Opportunities",
          text: "Local sports programmes can provide young people with opportunities to take part in organised activities."
        },
        {
          heading: "Learning Through Sport",
          text: "Participation can encourage teamwork, discipline, communication and confidence."
        },
        {
          heading: "Supporting Local Communities",
          text: "Families, schools, clubs and volunteers can work together to make sporting activities more accessible."
        }
      ]
    }
  };


  // -------------------------------------
  // 10. LOAD ARTICLE DETAILS
  // -------------------------------------

  const articleContent = document.getElementById("articleContent");

  if (articleContent) {

    const params = new URLSearchParams(window.location.search);

    const storyId = params.get("story") || "global-shift";

    const article = articles[storyId] || articles["global-shift"];

    function setText(id, value) {

      const element = document.getElementById(id);

      if (element && value) {
        element.textContent = value;
      }
    }

    setText("articleCategory", article.category);
    setText("articleTitle", article.title);
    setText("articleSubtitle", article.subtitle);
    setText("articleAuthor", article.author);
    setText("articleDate", article.date);
    setText("articleReadTime", article.read);
    setText("articleCaption", article.caption);
    setText("authorCardName", article.author);
    setText("breadcrumbCategory", article.category);

    const articleImage = document.getElementById("articleImage");

    if (articleImage) {
      articleImage.src = article.image;
      articleImage.alt = article.title;
    }

    document.title = article.title + " | The Briefline";

    articleContent.innerHTML = `
            <p class="text-xl leading-9 font-medium">
                ${article.subtitle}
            </p>

            ${article.sections.map((section, index) => `
                <section class="pt-5">
                    <h2 class="font-editorial text-3xl mb-4">
                        ${section.heading}
                    </h2>

                    <p class="text-muted leading-8">
                        ${section.text}
                    </p>

                    ${index === 0 ? `
                        <blockquote class="border-l-4 border-accent bg-white dark:bg-panel px-6 py-6 mt-7 italic font-editorial text-xl leading-8">
                            Stories help us understand the ideas and changes shaping our world.
                        </blockquote>
                    ` : ""}
                </section>
            `).join("")}
        `;

    const bookmarkButton = document.querySelector(".article-heading [data-save]");

    if (bookmarkButton) {
      bookmarkButton.dataset.save = storyId;
    }

    updateBookmarkButtons();
  }


  // -------------------------------------
  // 11. SHARE ARTICLE
  // -------------------------------------

  const shareButton = document.getElementById("shareButton");

  if (shareButton) {

    shareButton.addEventListener("click", async () => {

      const shareData = {
        title: document.title,
        text: "Read this story on The Briefline.",
        url: window.location.href
      };

      try {

        if (navigator.share) {

          await navigator.share(shareData);

        } else if (navigator.clipboard) {

          await navigator.clipboard.writeText(
            window.location.href
          );

          shareButton.textContent = "✓ Copied";

          setTimeout(() => {
            shareButton.textContent = "↗ Share";
          }, 2000);

        } else {

          window.prompt("Copy this article link:", window.location.href);

        }

      } catch (error) {

        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
    });
  }

});
