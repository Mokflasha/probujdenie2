let lastViewportHeight = window.innerHeight;

function updateIndicatorPosition() {
    const indicator = document.querySelector('.slider-indicator');
    const currentViewportHeight = window.innerHeight;
    
    // Если высота viewport изменилась (панель появилась/исчезла)
    if (Math.abs(currentViewportHeight - lastViewportHeight) > 10) {
        // Рассчитываем позицию в пикселях от верха
        const topInPixels = currentViewportHeight * 0.8;
        indicator.style.top = `${topInPixels}px`;
        
        lastViewportHeight = currentViewportHeight;
        console.log('Indicator position updated:', topInPixels, 'px');
    }
}

// Отслеживаем изменения размера окна
window.addEventListener('resize', updateIndicatorPosition);
window.addEventListener('scroll', updateIndicatorPosition);
window.addEventListener('orientationchange', updateIndicatorPosition);

// Также проверяем периодически на мобильных
setInterval(updateIndicatorPosition, 100);

document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger, SplitText);

	const lenis = new Lenis ();
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});
	gsap.ticker.lagSmoothing(0);

	const slides = [
		{
			title: "Ты ищешь путь домой, к себе",
			image: "./img/screen1.jpg",
			par: "Чувство, что главные ответы — где-то рядом, но ты проходишь мимо"
		},
		{
			title: "Ответы, которые ты ищешь, уже живут в тебе",
			image: "./img/screen2.jpg",
			par: "Моя роль — быть проводником к той версии вас, что уже свободна и цельная"
		},
		{
			title: "Пришло время отпустить старое и впустить новый свет",
			image: "./img/screen3.jpg",
			par: "Это момент, когда эго отступает, а душа начинает говорить"
		},
		{
			title: "Ты — источник своего света",
			image: "./img/screen4.jpg",
			par: "Теперь этот внутренний свет — не цель, а точка отсчёта. Я помогу сделать его ярче, научиться доверять ему и строить жизнь, исходя из этой полноты. Твоя настоящая жизнь только начинается."
		},
	];

	const pinDistance = window.innerHeight * slides.length;
	const progressBar = document.querySelector(".slider-progress");
	const sliderImages = document.querySelector(".slider-images");
	const sliderTitle = document.querySelector(".slider-title");
	const sliderPar = document.querySelector(".slider-par");
	const sliderIndices = document.querySelector(".slider-indices");

	let activeSlide = 0;
	let currentSplitTitle = null;
	let currentSplitPar = null;

	function createIndices() {
		sliderIndices.innerHTML = "";

		slides.forEach((_, index) => {
			const indexNum = (index + 1).toString().padStart(2, "0");
			const indicatorElement = document.createElement("p");
			indicatorElement.dataset.index = index;
			indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
			sliderIndices.appendChild(indicatorElement);

			if (index === 0){
				gsap.set(indicatorElement.querySelector(".index"), {
					opacity: 1,
				});
				gsap.set(indicatorElement.querySelector(".marker"), {
					scaleX: 1,
				});
			} else {
				gsap.set(indicatorElement.querySelector(".index"), {
					opacity: 0.35,
				});
				gsap.set(indicatorElement.querySelector(".marker"), {
					scaleX: 0,
				});
			}
		});
	}

	function animateNewSlide(index){
		const newSliderImage = document.createElement("img");
		newSliderImage.src = slides[index].image;
		newSliderImage.alt = `slide ${index + 1}`;

		gsap.set(newSliderImage,{
			opacity: 0,
			scale: 1.1,
		});

		sliderImages.appendChild(newSliderImage);

		gsap.to(newSliderImage, {
			opacity: 1,
			duration: 0.5,
			ease: "power2.out",
		});

		gsap.to(newSliderImage, {
			scale: 1,
			duration: 1,
			ease: "power2.out",
		});

		const allImages = sliderImages.querySelectorAll("img");
		// if (allImages.length > 3) {
		// 	const removeCount = allImages.length - 3;
		// 	for (let i = 0; i < removeCount; i++) {
		// 		sliderImages.removeChild(allImages[i]);
		// 	} 
		// }

		animateNewTitle(index);
		animateNewPar(index);
		animateIndicators(index);
	}


	function animateIndicators(index) {
		const indicators = sliderIndices.querySelectorAll("p");

		indicators.forEach((indicator, i) => {
			const markerElement = indicator.querySelector(".marker");
			const indexElement = indicator.querySelector(".index");

			if (i === index) {
				gsap.to(indexElement, {
					opacity: 1,
					duration: 0.3,
					ease: "power2.out"
				});
				gsap.to(markerElement, {
					scaleX: 1,
					duration: 0.3,
					ease: "power2.out"
				});
			} else {
					gsap.to(indexElement, {
					opacity: 0.5,
					duration: 0.3,
					ease: "power2.out"
				});
				gsap.to(markerElement, {
					scaleX: 0,
					duration: 0.3,
					ease: "power2.out"
				});
			}
		});
	}

	function animateNewTitle(index) {
		if (currentSplitTitle) {
			currentSplitTitle.revert();
		}

		sliderTitle.innerHTML = `<h1>${slides[index].title}</h1>`;

		currentSplitTitle = new SplitText(sliderTitle.querySelector("h1"), {
			type: "lines",
			lineClass: "line",
			mask: "lines",
		});

		if (index === slides.length - 1) {
			gsap.set(sliderTitle, {
					width: "90%", 
					margin: "0 auto",
			});
		} else {
				gsap.set(sliderTitle, {
						width: "80%", 
						margin: "0",
				});
    }

		gsap.set(currentSplitTitle.lines, {
			yPercent: 100,
			opacity: 0,
		});

		gsap.to(currentSplitTitle.lines, {
			yPercent: 0,
			opacity: 1,
			duration: 0.8,
			stagger: 0.1,
			ease: "power3.out",
		});
	}

	function animateNewPar(index) {
		if (currentSplitPar) {
			currentSplitPar.revert();
		}

		sliderPar.innerHTML = `<p>${slides[index].par}<p>`;

    
		if (index === slides.length - 1) {
			gsap.set(sliderPar, {
					width: "60%", 
					margin: "0 auto",
					top: "70%",
			});
		} else {
				gsap.set(sliderPar, {
						width: "36%", 
						margin: "0",
						top: "80%",
				});
    }
		if (index === slides.length - 1) {
        const button = document.createElement('a');
        button.className = 'button_slider';
        button.href = ""; 
        button.innerHTML = `
            <span>Сделать первый шаг</span>
            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M31 7.81522C30.9402 7.35452 30.8404 6.83373 30.7606 6.37304C30.242 3.82921 26.8906 1.70601 24.0181 1.64592C21.5046 1.60585 19.6294 3.04803 17.6346 4.18975C17.4351 4.30993 17.2556 4.53026 17.0361 4.59035C16.298 4.81068 15.9988 5.97244 15.2807 5.67198C14.7221 5.41159 14.5226 4.47017 14.1037 3.82921C12.3682 1.16519 8.33865 -0.717647 4.96737 0.263832C1.27692 1.3054 -0.0197222 5.23132 0.00022622 8.09564C0.0600713 11.2604 0.95775 14.2449 2.1746 17.1092C3.95001 21.0952 8.29875 30.3692 9.91457 29.9886C10.1938 29.9686 10.4731 29.9285 10.7325 29.9085L10.7125 29.8484C32.3365 24.0196 30.9402 7.79518 30.9402 7.79518H31V7.81522ZM14.1037 10.4792C14.7022 11.0601 14.5426 12.1017 14.2833 12.963C13.984 13.7642 13.6449 14.4252 12.6674 14.6054C12.0091 14.7056 11.8097 14.4652 11.9892 13.8643C12.2286 12.9429 12.4879 12.0216 13.1462 11.1402C13.4654 11.0601 13.4255 9.77817 14.1037 10.4792ZM26.0528 15.9475C23.8585 19.4127 21.4048 21.8363 18.652 23.8594C16.5773 25.3617 14.1636 26.3431 11.8097 27.2645C10.0742 27.9456 9.97441 27.9456 8.77751 26.5635C8.55808 26.3431 8.39849 26.1028 8.2389 25.8624C6.12438 22.1368 4.6083 18.1107 2.95259 14.1648C1.87537 11.5609 1.19713 8.79669 1.73573 5.91235C1.99506 4.87078 2.1746 3.80918 2.95259 2.98794C4.54846 1.22528 7.78009 1.02498 9.4757 2.80767C10.5729 3.94939 11.5104 5.17123 12.4081 6.49322C13.0066 7.35452 12.827 8.03555 12.2086 8.89684C11.2112 10.2789 10.2337 11.7411 9.99436 13.5038C9.73503 15.2064 10.3734 16.308 11.8296 16.8488C12.6674 17.1693 14.5426 16.4282 15.141 15.5469C16.3978 13.5438 16.9763 11.4206 16.318 9.07712C16.0587 8.09564 16.318 7.4747 17.096 6.83374C18.8315 5.47168 20.8463 4.59035 22.881 3.82921C25.0753 2.98794 27.6886 4.65044 28.1274 6.95391C28.7458 10.5193 27.2497 13.5038 26.0528 15.9475Z" fill="black"/>
						</svg>
						`;
        
        sliderPar.appendChild(button);


        gsap.fromTo(button, 
            { 
                opacity: 0, 
                y: 30,
                scale: 0.8 
            },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.6, 
                delay: 0.8, 
                ease: "power2.out" 
            }
        );
    }

		currentSplitPar = new SplitText(sliderPar.querySelector("p"), {
			type: "lines",
			wordsClass: "line",
			mask: "lines",
		});

		gsap.set(currentSplitPar.lines, {
			yPercent: 100,
			opacity: 0,
		});

		gsap.to(currentSplitPar.lines, {
			yPercent: 0,
			opacity: 1,
			duration: 0.8,
			stagger: 0.1,
			ease: "power3.out",
		});
	}

	createIndices();

	ScrollTrigger.create({
		trigger: ".slider",
		start: "top top",
		end: `+=${pinDistance}px`,
		scrub: 1,
		pin: true,
		pinSpacing: true,
		onUpdate: (self) => {
			gsap.set(progressBar, {
				scaleY: self.progress,
			});

			const currentSlide = Math.floor(self.progress * slides.length)
		
			if (activeSlide !== currentSlide && currentSlide < slides.length) {
				activeSlide = currentSlide;
				animateNewSlide(activeSlide);
			}
		},
	});


	const cardContainer = document.querySelector(".card-container");
	const stickyHeader = document.querySelector(".sticky-header h2");

	let isGapAnimationCompleted = false;
	let isFlipAnimationCompleted = false;

	function initAnimations(){
		// ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); //!!!!!!!!!!!!

		const mm = gsap.matchMedia();

		mm.add("(max-width: 1024px)", () => {
			document
				.querySelectorAll(".card, .card-container, .sticky-header h2")
				.forEach((el) => (el.style = ""));
			return {}
		});

		mm.add("(min-width: 1025px)", () => {
			ScrollTrigger.create({
				trigger: ".meeting",
				start: "top top",
				end: `+=${window.innerHeight * 4}px`,
				scrub: 1,
				pin: true,
				pinSpacing: true,
				onUpdate: (self) => {
					const progress = self.progress;

					if (progress >= 0.1 && progress <= 0.25) {
						const headerProgress = gsap.utils.mapRange(
							0.1,
							0.25,
							0,
							1,
							progress
						);
						const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
						const opacityValue = gsap.utils.mapRange(
							0,
							1,
							0,
							1,
							headerProgress
						);
						gsap.set(stickyHeader, {
							y: yValue,
							opacity: opacityValue,
						});
					} else if (progress < 0.1) {
						gsap.set(stickyHeader, {
							y: 40,
							opacity: 0,
						});
					} else if (progress > 0.25) {
						gsap.set(stickyHeader, {
							y: 0,
							opacity: 1,
						});
					}

					if (progress <= 0.25) {
						const widthPercentage = gsap.utils.mapRange(
							0,
							0.25,
							75,
							60,
							progress
						);
						gsap.set(cardContainer, { width: `${widthPercentage}%` });
					} else {
						gsap.set(cardContainer, { width: "60%" });
					}

					if (progress >= 0.35 && !isGapAnimationCompleted) {
						gsap.to(cardContainer, {
							gap: "20px",
							duration: 0.5,
							ease: "power3.out",
						});
							gsap.to(["#card-1", "#card-2", "#card-3"], {
							borderRadius: "10px",
							duration: 0.5,
							ease: "power3.out",
						});

						isGapAnimationCompleted = true;
					} else if (progress < 0.35 && isGapAnimationCompleted ) {
						gsap.to(cardContainer, {
							gap: "0px",
							duration: 0.5,
							ease: "power3.out",
						});
						gsap.to("#card-1", {
							borderRadius: "10px 0 0 10px",
							duration: 0.5,
							ease: "power3.out",
						});
						gsap.to("#card-2", {
							borderRadius: "0",
							duration: 0.5,
							ease: "power3.out",
						});
						gsap.to("#card-3", {
							borderRadius: "0 10px 10px 0",
							duration: 0.5,
							ease: "power3.out",
						});

						isGapAnimationCompleted = false;
					}

					if (progress >= 0.7 && !isFlipAnimationCompleted ) {
						gsap.to(".card", {
							rotationY: 180,
							duration: 0.75,
							ease: "power3.inOut",
							stagger: 0.1,
						});
						gsap.to(["#card-1", "#card-3"], {
							y: 30,
							rotationZ: (i) => [-15, 15][i],
							duration: 0.75,
							ease: "power3.inOut",
						});
						isFlipAnimationCompleted = true;
					} else if (progress < 0.7 && isFlipAnimationCompleted ) {
						gsap.to(".card", {
							rotationY: 0,
							duration: 0.75,
							ease: "power3.inOut",
							stagger: -0.1,
						});
						gsap.to(["#card-1", "#card-3"], {
							y: 0,
							rotationZ: 0,
							duration: 0.75,
							ease: "power3.inOut",
						});
						isFlipAnimationCompleted = false;
					}	
				}
			});
		});
	}

	initAnimations();

	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			initAnimations();
		}, 250)
	})
})



// Бургер-меню
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerBtn = document.querySelector('.burger-btn');
    const burgerClose = document.querySelector('.burger-close');
    const burgerOverlay = document.querySelector('.burger-overlay');
    const burgerLinks = document.querySelectorAll('.burger-link');
    
    
    burgerBtn.addEventListener('click', function() {
        burgerMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    
    function closeMenu() {
        burgerMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    burgerClose.addEventListener('click', closeMenu);
    burgerOverlay.addEventListener('click', closeMenu);
    
    
    burgerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            closeMenu();
            
            
            setTimeout(() => {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }, 300);
        });
    });
    
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && burgerMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    const sliderContainer = document.querySelector('.slider').parentElement; 
    
    function handleScroll() {
        const sliderRect = sliderContainer.getBoundingClientRect();
        
        if (sliderRect.bottom <= 0) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
});