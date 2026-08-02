import whyUsImage from "../assets/why-us-car.jpg";

const FEATURES = [
  { icon: "💸", title: "Best Deal", desc: "Transparent daily pricing, no surprise markups." },
  { icon: "🚪", title: "Doorstep Delivery", desc: "We bring the car to you, at the time you pick." },
  { icon: "🔒", title: "Low Security Deposit", desc: "Rent without tying up a month's savings." },
  { icon: "🚘", title: "Latest Cars", desc: "A fleet refreshed every season, not every decade." },
  { icon: "🎧", title: "Customer Support", desc: "Real people, reachable while you're on the road." },
  { icon: "🧾", title: "No Hidden Charges", desc: "What you see at checkout is what you pay." },
];

export default function WhyUs() {
  return (
    <section className="bg-soft py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <img
            src={whyUsImage}
            alt="A car ready for rental"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_20px_30px_rgba(20,21,26,0.2)]"
          />
        </div>

        <div>
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ Why rent with us
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Built to make renting effortless
          </h2>
          <p className="mt-2.5 max-w-md text-muted">
            We designed every step — from search to drop-off — around the small frictions that
            usually make car rental annoying.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-amber/10 text-xl">
                  {f.icon}
                </span>
                <div>
                  <h4 className="mb-0.5 text-sm font-semibold">{f.title}</h4>
                  <p className="text-[13.5px] leading-relaxed text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
