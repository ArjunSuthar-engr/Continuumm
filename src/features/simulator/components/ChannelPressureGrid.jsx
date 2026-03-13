import { channelDescriptions } from '../../../data/projectContent'

function ChannelPressureGrid({ channelPressure }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Transmission channels</p>
          <h2 className="panel-title">Why the network moves</h2>
        </div>
        <p className="panel-copy">
          Each channel score is a structural pressure indicator, not a forecast of
          exact market outcomes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(channelPressure).map(([channel, score]) => (
          <article key={channel} className="channel-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{channel}</p>
                <h3 className="mt-2 text-2xl text-stone-100">{score}/100</h3>
              </div>
              <span className="mono rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                pressure
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {channelDescriptions[channel]}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ChannelPressureGrid
