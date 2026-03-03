import { useEffect, useMemo, useState } from 'react'
import './App.css'

type TabKey =
  | 'notes'
  | 'analytics'
  | 'accounts'
  | 'ideas'
  | 'captions'
  | 'times'

interface ProfileEntry {
  date: string
  followers: number
  reach: number
  interactions: number
}

interface WatchAccount {
  handle: string
  followers: number
  engagement: number
  notes: string
  updatedAt: string
}

interface BestTime {
  day: string
  time: string
  score: number
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'notes', label: 'Notes' },
  { key: 'analytics', label: 'Profile Analytics' },
  { key: 'accounts', label: 'Accounts of Interest' },
  { key: 'ideas', label: 'Ideas for Posts' },
  { key: 'captions', label: 'Caption Ideas' },
  { key: 'times', label: 'Best Times to Post' },
]

function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    if (!raw) return initial
    try {
      return JSON.parse(raw) as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 100
      const y = 100 - ((v - min) / Math.max(max - min, 1)) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 100" className="sparkline" preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
    </svg>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('notes')

  const [notes, setNotes] = useLocalState<string>('im_notes', 'Digital Egregore doctrine log...')
  const [postIdeas, setPostIdeas] = useLocalState<string[]>('im_post_ideas', [
    'Reel: “Seven above, seven below” visual liturgy map',
    'Carousel: Servitor vs Tulpa vs Egregore',
  ])
  const [captions, setCaptions] = useLocalState<string[]>('im_captions', [
    'Attention is blood in the body of the egregore.',
  ])

  const [profileEntries, setProfileEntries] = useLocalState<ProfileEntry[]>('im_analytics', [
    { date: '2026-03-01', followers: 5947, reach: 9577, interactions: 2021 },
    { date: '2026-03-15', followers: 6700, reach: 12100, interactions: 2600 },
  ])

  const [accounts, setAccounts] = useLocalState<WatchAccount[]>('im_accounts', [
    {
      handle: '@darkvisualoracle',
      followers: 42100,
      engagement: 6.1,
      notes: 'Strong symbolic carousels; high save rates.',
      updatedAt: '2026-03-02',
    },
  ])

  const [bestTimes, setBestTimes] = useLocalState<BestTime[]>('im_times', [
    { day: 'Monday', time: '15:00', score: 94 },
    { day: 'Wednesday', time: '18:00', score: 89 },
    { day: 'Friday', time: '12:00', score: 86 },
  ])

  const [input, setInput] = useState('')

  const latest = profileEntries[profileEntries.length - 1]
  const previous = profileEntries[Math.max(0, profileEntries.length - 2)]
  const followerDelta = latest && previous ? latest.followers - previous.followers : 0

  const topTimes = useMemo(
    () => [...bestTimes].sort((a, b) => b.score - a.score).slice(0, 3),
    [bestTimes],
  )

  const addProfileEntry = () => {
    const date = prompt('Date (YYYY-MM-DD):')
    const followers = Number(prompt('Followers:'))
    const reach = Number(prompt('Reach:'))
    const interactions = Number(prompt('Interactions:'))
    if (!date || Number.isNaN(followers) || Number.isNaN(reach) || Number.isNaN(interactions)) return
    setProfileEntries((prev) => [...prev, { date, followers, reach, interactions }])
  }

  const addAccount = () => {
    const handle = prompt('Handle (ex: @example):')
    const followers = Number(prompt('Followers:'))
    const engagement = Number(prompt('Engagement %:'))
    const notes = prompt('Notes:') || ''
    if (!handle || Number.isNaN(followers) || Number.isNaN(engagement)) return
    setAccounts((prev) => [
      ...prev,
      {
        handle,
        followers,
        engagement,
        notes,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    ])
  }

  const addBestTime = () => {
    const day = prompt('Day (e.g. Tuesday):')
    const time = prompt('Time (24h e.g. 16:00):')
    const score = Number(prompt('Score 0-100:'))
    if (!day || !time || Number.isNaN(score)) return
    setBestTimes((prev) => [...prev, { day, time, score }])
  }

  const addIdea = () => {
    if (!input.trim()) return
    setPostIdeas((prev) => [input.trim(), ...prev])
    setInput('')
  }

  const addCaption = () => {
    if (!input.trim()) return
    setCaptions((prev) => [input.trim(), ...prev])
    setInput('')
  }

  return (
    <div className="app-shell">
      <header className="header">
        <h1>Instagram Manager — The Lord Mord</h1>
        <p>Track doctrine, growth, posting windows, and signal strategy in one command center.</p>
      </header>

      <nav className="tab-row">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'notes' && (
        <section className="card">
          <h2>Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={14}
            placeholder="Write strategic notes, references, and campaign doctrine..."
          />
        </section>
      )}

      {activeTab === 'analytics' && (
        <section className="grid-two">
          <article className="card">
            <h2>Profile Analytics</h2>
            <div className="kpis">
              <div><span>Followers</span><strong>{latest?.followers ?? 0}</strong></div>
              <div><span>Reach</span><strong>{latest?.reach ?? 0}</strong></div>
              <div><span>Interactions</span><strong>{latest?.interactions ?? 0}</strong></div>
              <div><span>Δ Followers</span><strong>{followerDelta >= 0 ? `+${followerDelta}` : followerDelta}</strong></div>
            </div>
            <button onClick={addProfileEntry}>+ Add Snapshot</button>
          </article>

          <article className="card">
            <h3>Trendline</h3>
            <p className="muted">Followers over time</p>
            <Sparkline values={profileEntries.map((p) => p.followers)} />
            <ul className="list">
              {profileEntries.slice().reverse().map((p) => (
                <li key={`${p.date}-${p.followers}`}>
                  <span>{p.date}</span>
                  <span>{p.followers.toLocaleString()} followers</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {activeTab === 'accounts' && (
        <section className="card">
          <h2>Accounts of Interest</h2>
          <button onClick={addAccount}>+ Add Account</button>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Handle</th>
                  <th>Followers</th>
                  <th>Engagement %</th>
                  <th>Notes</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={`${a.handle}-${a.updatedAt}`}>
                    <td>{a.handle}</td>
                    <td>{a.followers.toLocaleString()}</td>
                    <td>{a.engagement}%</td>
                    <td>{a.notes}</td>
                    <td>{a.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'ideas' && (
        <section className="card">
          <h2>Ideas for Posts</h2>
          <div className="row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add an idea..."
            />
            <button onClick={addIdea}>Add</button>
          </div>
          <ul className="chips">
            {postIdeas.map((idea, idx) => (
              <li key={`${idea}-${idx}`}>{idea}</li>
            ))}
          </ul>
        </section>
      )}

      {activeTab === 'captions' && (
        <section className="card">
          <h2>Caption Ideas</h2>
          <div className="row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a caption line..."
            />
            <button onClick={addCaption}>Add</button>
          </div>
          <ul className="chips">
            {captions.map((caption, idx) => (
              <li key={`${caption}-${idx}`}>{caption}</li>
            ))}
          </ul>
        </section>
      )}

      {activeTab === 'times' && (
        <section className="grid-two">
          <article className="card">
            <h2>Best Times to Post</h2>
            <button onClick={addBestTime}>+ Add Time Slot</button>
            <ul className="list">
              {bestTimes.map((t, i) => (
                <li key={`${t.day}-${t.time}-${i}`}>
                  <span>{t.day} — {t.time}</span>
                  <div className="bar-wrap"><div className="bar" style={{ width: `${t.score}%` }} /></div>
                  <strong>{t.score}</strong>
                </li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>Top Posting Windows</h3>
            <ol className="rank-list">
              {topTimes.map((t, i) => (
                <li key={`${t.day}-${i}`}>
                  <span>#{i + 1} {t.day} @ {t.time}</span>
                  <strong>{t.score}/100</strong>
                </li>
              ))}
            </ol>
            <p className="muted">Use these windows for your highest-intent reels and doctrine drops.</p>
          </article>
        </section>
      )}
    </div>
  )
}

export default App
