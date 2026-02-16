'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    body: "In Lisbon you walk everywhere. Charming cobblestones, trams, the occasional existential stroll along the Tagus. In America you'll need a vehicle the size of a Portuguese apartment just to buy groceries. Bonus: it gets 8 miles per gallon, has never been off-road, and the owner will cut you off in a school zone.",
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
    title: 'Freedom Refreshment',
    subtitle: 'Because tap water is apparently communism',
    body: "Americans buy water in bulk like they're prepping for the apocalypse. Every gas station run requires a 48-pack of plastic bottles and enough ice to sink the Titanic twice. Meanwhile in Lisbon, you drink from the tap like a normal person and nobody bats an eye. But sure, tell me more about freedom of choice.",
    tag: 'HYDRATION NATION',
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
        className="flex h-16 w-16 items-center justify-center rounded-lg sm:h-20 sm:w-20"
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
          className="text-2xl font-black tabular-nums sm:text-3xl"
          style={{ color: '#FBBF24' }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/70">
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
      {/* Hero title */}
      <div className="mb-6 text-center">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-black uppercase tracking-tight sm:text-5xl"
          style={{ color: '#DC2626', lineHeight: 1.1 }}
        >
          The Great
          <br />
          <span
            className="text-4xl sm:text-6xl"
            style={{
              color: '#FBBF24',
              textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            }}
          >
            Regression
          </span>
          <br />
          Countdown
        </motion.h1>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-red-500/50">
          {daysLeft} days until freedom costs $4.89/gallon
        </p>
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

      {/* Satirical cards */}
      <div className="flex flex-col gap-6">
        {SNARK_CARDS.map((card, i) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
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
                className="object-cover"
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
          </motion.article>
        ))}
      </div>

      {/* Bottom sign-off */}
      <div className="mt-10 mb-4 text-center">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: 'rgba(220, 38, 38, 0.4)' }}
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
