'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { DEPARTURE_DATE } from '@/lib/constants';

interface SnarkCard {
  image: string;
  title: string;
  subtitle: string;
  body: string;
  tag: string;
}

const SNARK_CARDS: SnarkCard[] = [
  {
    image: '/images/strip-mall.jpg',
    title: 'Welcome to Anywhere, U.S.A.',
    subtitle: 'Now with more parking than nature',
    body: "You've been spoiled by centuries-old plazas with hand-laid cobblestones. Get ready for the strip mall: a concrete monument to convenience where every town looks the same, the architecture peaked in 1987, and the highlight is a CVS next to a mattress store that's been having a 'going out of business' sale for 6 years.",
    tag: 'SUBURBAN PARADISE',
  },
  {
    image: '/images/lifted-truck.jpg',
    title: 'Compensating for Something',
    subtitle: 'The official vehicle of "I need milk from the store"',
    body: "In Lisbon you walk everywhere. Charming cobblestones, trams, the occasional existential stroll along the Tagus. In America you'll need a vehicle the size of a Portuguese apartment just to buy groceries. Bonus: it gets 8 miles per gallon, has never been off-road, and the owner will cut you off in a school zone because he has a small penis.",
    tag: 'AUTOMOTIVE CULTURE',
  },
  {
    image: '/images/mcmansion.jpg',
    title: 'HOA Approved Dystopia',
    subtitle: 'Where individuality goes to die',
    body: "Trade your apartment with 300 years of character for a beige box in a subdivision where every house is identical, your mailbox must be regulation height, and painting your door the wrong shade of gray gets you a $200 fine. But hey, at least there's a community pool that closes at 7pm.",
    tag: 'THE AMERICAN DREAM',
  },
  {
    image: '/images/drive-through.jpg',
    title: 'The Drive-Through Lifestyle',
    subtitle: "Why walk when you can idle?",
    body: "In Portugal, you sit at a café for two hours over one espresso and nobody judges you. In America, you'll wait 35 minutes in a drive-through line of 47 SUVs for a coffee that's 90% ice, 8% milk, and 2% regret. And you'll do it from your car because walking 50 feet to the door is apparently too European.",
    tag: 'CULINARY EFFICIENCY',
  },
  {
    image: '/images/water-bottles.jpg',
    title: 'Hydration Emergency',
    subtitle: "We're leaving the house — grab 47 water bottles",
    body: "Americans cannot go anywhere without a personal water supply like they're crossing the Sahara on foot. Going to Target? Better bring three Yeti bottles. Driving ten minutes to soccer practice? Pack a cooler. It's not like there will be water where you're going or anything. Every outing is treated like a survival expedition. Meanwhile in Lisbon, you walk for hours in 35°C heat and somehow survive with a single espresso and the occasional fountain. But sure, you definitely need that 64oz Stanley tumbler to sit in an air-conditioned office.",
    tag: 'HYDRATION EMERGENCY',
  },
  {
    image: '/images/olive-garden.jpg',
    title: 'Unlimited Breadsticks Await',
    subtitle: "When you're here, you're family (terms and conditions apply)",
    body: "You've been ruined by actual Portuguese restaurants where the owner knows your name and the fish was caught this morning. Get ready for chain dining: laminated menus, breadsticks that taste like warm styrofoam, and a waiter who introduces himself as your 'dining experience coordinator.' The microwave is the real chef.",
    tag: 'FINE DINING',
  },
  {
    image: '/images/portions.jpg',
    title: 'Portions That Feed a Village',
    subtitle: 'One entrée = three Portuguese meals',
    body: "In Lisbon, portions are human-sized. In America, your 'appetizer' arrives on a plate the size of a satellite dish. Your burger is architecturally unstable. Your soda comes in a vessel that could hydrate a small nation. And when you can't finish it, they put it in a styrofoam box so you can throw it away at home instead.",
    tag: 'SUPER-SIZED',
  },
  {
    image: '/images/tipping.jpg',
    title: 'Tipping Math Anxiety',
    subtitle: '18%? 20%? 22%? 25%? WHY IS THIS MY JOB?',
    body: "In Portugal the price is the price. Revolutionary concept. In America, every transaction ends with a tablet swiveled aggressively toward your face displaying tip options that start at 20% — for handing you a muffin. The mental math alone requires a PhD. Tip wrong and your barista will remember your face forever.",
    tag: 'ECONOMIC THRILLER',
  },
  {
    image: '/images/gofundme.jpg',
    title: "America's Real Healthcare Plan",
    subtitle: 'GoFundMe: because insurance is just a suggestion',
    body: "In Portugal you walk into a hospital, get treated, and walk out. Wild concept. In America, a broken arm costs more than a used car, and your insurance company's full-time job is finding reasons not to pay. The real national healthcare system? GoFundMe pages where strangers donate $25 so you can afford insulin. Land of the free, home of the 'please help my family' fundraisers.",
    tag: 'HEALTHCARE FREEDOM',
  },
  {
    image: '/images/school-drills.jpg',
    title: 'Active Shooter Drill Day',
    subtitle: 'Right between art class and recess',
    body: "In Lisbon, your kid's biggest school worry is forgetting their lanche. In America, six-year-olds practice hiding under desks and staying quiet so a pretend gunman can't find them — then they go to lunch and trade snacks like everything's normal. Schools have more security protocols than most airports. But sure, the problem is definitely doors.",
    tag: 'CHILDHOOD IN AMERICA',
  },
  {
    image: '/images/theater-exits.jpg',
    title: 'Know Your Exits',
    subtitle: 'Step 1 of enjoying any American public space',
    body: "In Portugal, you walk into a cinema and think about popcorn. In America, you walk into a cinema and immediately clock every exit, mentally rehearse your escape route, and wonder if that guy's backpack is just a backpack. Concerts, malls, movie theaters, schools — every public gathering comes with a complimentary side of low-grade anxiety. But hey, freedom.",
    tag: 'SITUATIONAL AWARENESS',
  },
  {
    image: '/images/drug-commercials.jpg',
    title: 'Ask Your Doctor About...',
    subtitle: 'Side effects may include: watching this commercial',
    body: "In Portugal, drugs are prescribed by doctors. In America, drugs are advertised between segments of the evening news by actors frolicking through meadows while a narrator speed-reads 47 seconds of side effects including 'sudden death.' You're supposed to then tell YOUR doctor what pills you want, like you're ordering off a menu. 'I'll have the Ozempic with a side of unexplained rash, please.'",
    tag: 'BIG PHARMA VIBES',
  },
  {
    image: '/images/measurements.jpg',
    title: 'The Imperial Delusion',
    subtitle: "Fahrenheit, feet, and fluid ounces — oh my",
    body: "You've spent years thinking in Celsius like a rational human. Welcome back to a country that measures temperature in a scale invented by a guy who used horse blood as a reference point. Distances in miles, weight in pounds, volume in cups — which are different from fluid ounces, which are different from regular ounces. Even Americans don't understand it. They just pretend to.",
    tag: 'UNIT OF CHAOS',
  },
  {
    image: '/images/yard-signs.jpg',
    title: 'Yard Sign Civil War',
    subtitle: 'Where lawn care meets political warfare',
    body: "In Lisbon, neighbors argue about noise during Santos Populares and then share sardines. In America, your neighbor plants a political yard sign, you plant a bigger one, they add a flag, you add a flagpole, and by November nobody on the street is speaking to each other. The HOA somehow has an opinion about sign dimensions but not the complete collapse of neighborhood civility.",
    tag: 'DEMOCRACY IN ACTION',
  },
  {
    image: '/images/parking-lot-coffee.jpg',
    title: 'Café Culture, American Style',
    subtitle: 'Cardboard cup, asphalt view, zero charm',
    body: "In Lisbon, you sit at a quiosque under ancient trees, sip a bica from a real ceramic cup, and watch the river shimmer. In America, you sit on a plastic chair outside a strip mall Starbucks, drink something called a 'Venti Caramel Ribbon Crunch Frappuccino' from a cardboard bucket, and your view is a Costco parking lot, three shopping carts, and a guy in a lifted truck taking up two spaces. But hey, there's free Wi-Fi.",
    tag: 'CAFÉ CULTURE',
  },
];

const TICKER_ITEMS = [
  'BREAKING: Local man describes 2-hour commute as "not that bad"',
  'DEVELOPING: Neighborhood HOA debates approved shade of beige for 9th consecutive meeting',
  'ALERT: Family of 4 spends $147 on "quick lunch"',
  'JUST IN: Costco sample lady achieves cult following',
  'UPDATE: Man who has never left Ohio declares it "the best country on earth"',
  'BREAKING: Suburban dad fired up the grill. Neighbors alerted.',
  'REPORT: Local pharmacy now larger than most European hospitals',
  'TRENDING: Gas station discovered to have better wine selection than local restaurant',
  'ANALYSIS: It takes 3 turns and a highway on-ramp to reach house next door',
  'EXCLUSIVE: Ice consumption per capita exceeds rest of world combined',
  'BREAKING: GoFundMe now America\'s largest healthcare provider by volume',
  'DEVELOPING: Third graders complete active shooter drill faster than fire drill',
  'ALERT: Man diagnosed with "mild" condition, GoFundMe goal set at $250,000',
  'JUST IN: Pharmaceutical company releases drug to treat side effects of other drug',
  'UPDATE: Family argues over whether 68°F is "freezing" or "boiling"',
  'TRENDING: Neighbor adds 14th political yard sign, property values plummet',
  'BREAKING: Woman pays $800 for ambulance ride across hospital parking lot',
  'ALERT: School district spends more on bulletproof backpacks than textbooks',
  'JUST IN: Man refinances home to pay for son\'s emergency room visit',
  'DEVELOPING: Entire neighborhood unfriends each other on Facebook over yard signs',
  'REPORT: Average American now spends 4.7 years of life sitting in traffic',
  'EXCLUSIVE: Taco Bell classified as "Mexican restaurant" on local food blog',
  'UPDATE: Walmart greeter has seen things. Will not elaborate.',
  'TRENDING: Man brings assault rifle to Applebee\'s, calls it "personal freedom"',
  'BREAKING: Insurance company denies claim because patient was "too sick"',
  'ANALYSIS: Average kindergartner can identify 12 exit routes but only 4 letters',
  'ALERT: Family declares bankruptcy after daughter\'s allergic reaction to bee',
  'JUST IN: Uber driver now making less than the car is depreciating',
  'DEVELOPING: Man drives 45 minutes to avoid paying $2 more for gas',
  'REPORT: Local Olive Garden busier than actual Italian restaurant next door',
  'EXCLUSIVE: HOA president impeached after approving non-regulation mailbox',
  'UPDATE: Area man claims he "doesn\'t watch TV" but can quote every Fox News segment',
  'BREAKING: Pharmaceutical ad side effects now longer than the actual show',
  'TRENDING: Florida man does something. Details at 11.',
  'ALERT: Child asks "what\'s walkable infrastructure?" Parents have no answer',
  'JUST IN: Starbucks drink order now longer than the Gettysburg Address',
  'DEVELOPING: Congress approves thoughts and prayers as official medical treatment',
  'REPORT: Grocery store self-checkout now requires engineering degree',
  'EXCLUSIVE: Man spends $400/month on streaming services, complains about $4 bread',
  'UPDATE: 911 operator asks caller to verify insurance before dispatching ambulance',
  'BREAKING: Local church parking lot bigger than most Portuguese villages',
  'ANALYSIS: Cost of giving birth now exceeds cost of the car you drove there in',
  'TRENDING: American discovers walking is free, goes viral',
  'ALERT: Restaurant adds 8% "inflation surcharge" on top of expected 25% tip',
  'JUST IN: Suburb built with no sidewalks reports record rates of "loneliness"',
  'DEVELOPING: Man pays $37 to park at hospital where he\'ll pay $3,700',
  'REPORT: TSA confiscates water bottle, allows everything else through',
  'EXCLUSIVE: College graduate\'s student loan payment exceeds rent. Both are unaffordable.',
  'UPDATE: "Affordable housing" listing found at only $2,800/month for a studio',
  'BREAKING: Kid expelled for pointing finger in shape of gun. Actual guns still fine.',
];

function getDaysLeft(): number {
  const diff = DEPARTURE_DATE.getTime() - new Date().getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function getTimeLeft() {
  const diff = DEPARTURE_DATE.getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-lg sm:h-16 sm:w-16"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
          border: '1px solid rgba(220, 38, 38, 0.4)',
          boxShadow: '0 0 30px rgba(220, 38, 38, 0.15)',
        }}
      >
        <motion.span
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-black tabular-nums sm:text-2xl"
          style={{ color: '#FBBF24' }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-red-500/70">
        {label}
      </span>
    </div>
  );
}

function NewsTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="overflow-hidden border-y py-2"
      style={{
        borderColor: 'rgba(220, 38, 38, 0.3)',
        background: 'rgba(220, 38, 38, 0.05)',
      }}
    >
      <div className="flex items-center gap-3 px-4">
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-black tracking-wider"
          style={{ background: '#DC2626', color: '#fff' }}
        >
          LIVE
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-medium"
            style={{ color: '#FBBF24' }}
          >
            {TICKER_ITEMS[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SnarkCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useMotionValue(0);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoAdvance = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const startAutoAdvance = useCallback(() => {
    stopAutoAdvance();
    if (paused) return;
    autoTimerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SNARK_CARDS.length);
    }, 12000);
  }, [paused, stopAutoAdvance]);

  useEffect(() => {
    startAutoAdvance();
    return stopAutoAdvance;
  }, [startAutoAdvance, stopAutoAdvance]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    startAutoAdvance();
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SNARK_CARDS.length) % SNARK_CARDS.length);
    startAutoAdvance();
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SNARK_CARDS.length);
    startAutoAdvance();
  };

  const togglePause = () => {
    setPaused((prev) => !prev);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold || info.velocity.x < -500) {
      goNext();
    } else if (info.offset.x > threshold || info.velocity.x > 500) {
      goPrev();
    }
  };

  const card = SNARK_CARDS[current];

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div>
      {/* Carousel container */}
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: 380 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            className="cursor-grab active:cursor-grabbing"
          >
            <article
              className="overflow-hidden rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 640px) 100vw, 512px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(10,10,10,0.8) 0%, transparent 50%)',
                  }}
                />
                <span
                  className="absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                  style={{
                    background: '#DC2626',
                    color: '#FBBF24',
                  }}
                >
                  {card.tag}
                </span>
                {/* Card counter */}
                <span
                  className="absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold tabular-nums"
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {current + 1} / {SNARK_CARDS.length}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2
                  className="text-lg font-black uppercase leading-tight sm:text-xl"
                  style={{ color: '#eee' }}
                >
                  {card.title}
                </h2>
                <p
                  className="mt-0.5 text-sm font-semibold italic"
                  style={{ color: '#DC2626' }}
                >
                  {card.subtitle}
                </p>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {card.body}
                </p>
              </div>
            </article>
          </motion.div>
        </AnimatePresence>

        {/* Arrow controls — positioned in lower part of image area */}
        <button
          onClick={goPrev}
          className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full text-xl font-black transition-transform active:scale-90"
          style={{
            top: '40%',
            background: 'rgba(220, 38, 38, 0.85)',
            color: '#FBBF24',
            border: '2px solid #FBBF24',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
          }}
        >
          ‹
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full text-xl font-black transition-transform active:scale-90"
          style={{
            top: '40%',
            background: 'rgba(220, 38, 38, 0.85)',
            color: '#FBBF24',
            border: '2px solid #FBBF24',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
          }}
        >
          ›
        </button>
      </div>

      {/* Controls row: dots + pause */}
      <div className="mt-3 flex items-center justify-center gap-3">
        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {SNARK_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === current ? 20 : 8,
                background: i === current ? '#FBBF24' : 'rgba(220, 38, 38, 0.3)',
              }}
            />
          ))}
        </div>

        {/* Pause / Play button */}
        <button
          onClick={togglePause}
          className="flex h-7 items-center gap-1 rounded-full px-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
          style={{
            background: paused ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            color: paused ? '#FBBF24' : 'rgba(255, 255, 255, 0.4)',
            border: paused ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {paused ? '▶ Play' : '⏸ Pause'}
        </button>
      </div>
    </div>
  );
}

export default function MericaExperience() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const daysLeft = getDaysLeft();

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Comic Book Header with Trump Illustration */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {/* Trump illustration */}
          <motion.div
            initial={{ scale: 0.8, rotate: -3, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative shrink-0"
          >
            <div
              className="h-28 w-28 overflow-hidden rounded-xl sm:h-36 sm:w-36"
              style={{
                border: '3px solid #FBBF24',
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.2), 4px 4px 0 #DC2626',
              }}
            >
              <Image
                src="/images/trump-cartoon.jpg"
                alt="Satirical cartoon illustration"
                fill
                className="object-cover"
                sizes="144px"
                priority
              />
            </div>
          </motion.div>

          {/* Title in Bangers font */}
          <div className="flex-1">
            <motion.h1
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
              className="text-2xl uppercase leading-none sm:text-4xl"
              style={{
                fontFamily: 'var(--font-comic), var(--font-body)',
                color: '#FBBF24',
                textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
                transform: 'rotate(-1deg)',
              }}
            >
              The Great
            </motion.h1>
            <motion.h1
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 150 }}
              className="text-3xl uppercase leading-none sm:text-5xl"
              style={{
                fontFamily: 'var(--font-comic), var(--font-body)',
                color: '#FBBF24',
                textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 0 0 40px rgba(251, 191, 36, 0.3)',
                transform: 'rotate(1deg)',
              }}
            >
              Regression
            </motion.h1>
            <motion.p
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-1 text-lg uppercase sm:text-xl"
              style={{
                fontFamily: 'var(--font-comic), var(--font-body)',
                color: '#DC2626',
                textShadow: '1px 1px 0 #000',
              }}
            >
              Countdown <span className="text-2xl sm:text-3xl">2026</span>
            </motion.p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-center text-xs font-medium uppercase tracking-[0.3em]"
          style={{ color: '#FBBF24' }}
        >
          {daysLeft} days until freedom costs $20/dozen
        </motion.p>
      </div>

      {/* Countdown clock */}
      <div className="mb-6 flex justify-center gap-3 sm:gap-4">
        <CountdownBlock value={timeLeft.days} label="Days" />
        <CountdownBlock value={timeLeft.hours} label="Hours" />
        <CountdownBlock value={timeLeft.minutes} label="Min" />
        <CountdownBlock value={timeLeft.seconds} label="Sec" />
      </div>

      {/* News ticker */}
      <div className="mb-8">
        <NewsTicker />
      </div>

      {/* Satirical Card Carousel */}
      <SnarkCarousel />

      {/* Bottom sign-off */}
      <div className="mt-10 mb-4 text-center">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-comic), var(--font-body)',
            color: 'rgba(220, 38, 38, 0.5)',
          }}
        >
          God bless this mess
        </p>
        <p
          className="mt-1 text-[10px] tracking-wider"
          style={{ color: 'rgba(255, 255, 255, 0.15)' }}
        >
          A satirical production by two families who will miss Lisbon terribly
        </p>
      </div>
    </motion.div>
  );
}
