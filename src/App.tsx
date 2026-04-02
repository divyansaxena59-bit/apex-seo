import { useState } from 'react'
import './App.css'
import { analyzeReadability } from './services/readability'
import { analyzeKeyphrase } from './services/keyphrase'
import { calculateSeoScore } from './services/seoScorer'

function App() {
  // Form inputs
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyphrase, setFocusKeyphrase] = useState('')
  const [h1, setH1] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [hasImages, setHasImages] = useState(false)
  const [imageAltCount, setImageAltCount] = useState(0)
  const [totalImages, setTotalImages] = useState(0)
  const [hasSchema, setHasSchema] = useState(false)
  const [hasOgTags, setHasOgTags] = useState(false)
  const [hasCanonical, setHasCanonical] = useState(false)

  // Analysis results
  const [seoScore, setSeoScore] = useState<any>(null)
  const [readability, setReadability] = useState<any>(null)
  const [keyphrase, setKeyphrase] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('analyzer')

  const handleAnalyze = () => {
    // Calculate all metrics
    const readabilityMetrics = analyzeReadability(bodyText)
    const keyphraseAnalysis = analyzeKeyphrase(
      focusKeyphrase,
      metaTitle,
      metaDescription,
      h1,
      bodyText
    )
    const score = calculateSeoScore({
      metaTitle,
      metaDescription,
      bodyText,
      focusKeyphrase,
      h1,
      hasImages,
      imageAltTextCount: imageAltCount,
      totalImages: totalImages || 1,
      hasSchema,
      hasOgTags,
      hasCanonical,
    })

    setReadability(readabilityMetrics)
    setKeyphrase(keyphraseAnalysis)
    setSeoScore(score)
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>🚀 Apex SEO Plugin</h1>
        <p>World-Class Shopify SEO Analyzer</p>
      </header>

      <div className="main-content">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
          >
            📝 SEO Analyzer
          </button>
          <button
            className={`tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Results
          </button>
        </div>

        {/* Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <div className="analyzer-section">
            <div className="form-group">
              <label>Meta Title</label>
              <input
                type="text"
                placeholder="Enter meta title (30-60 chars)"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={60}
              />
              <small>{metaTitle.length}/60</small>
            </div>

            <div className="form-group">
              <label>Meta Description</label>
              <textarea
                placeholder="Enter meta description (120-160 chars)"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={160}
                rows={3}
              />
              <small>{metaDescription.length}/160</small>
            </div>

            <div className="form-group">
              <label>Focus Keyphrase</label>
              <input
                type="text"
                placeholder="e.g., best running shoes"
                value={focusKeyphrase}
                onChange={(e) => setFocusKeyphrase(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>H1 Tag</label>
              <input
                type="text"
                placeholder="Main heading (H1)"
                value={h1}
                onChange={(e) => setH1(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Body Content</label>
              <textarea
                placeholder="Paste your full product description or article content"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={8}
              />
              <small>{bodyText.split(/\s+/).filter(w => w).length} words</small>
            </div>

            <div className="form-group">
              <label>Additional SEO Factors</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={hasImages}
                    onChange={(e) => setHasImages(e.target.checked)}
                  />
                  Has Images
                </label>
                {hasImages && (
                  <>
                    <input
                      type="number"
                      placeholder="Images with alt text"
                      value={imageAltCount}
                      onChange={(e) => setImageAltCount(Number(e.target.value))}
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Total images"
                      value={totalImages}
                      onChange={(e) => setTotalImages(Number(e.target.value))}
                      min="0"
                    />
                  </>
                )}
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={hasSchema}
                    onChange={(e) => setHasSchema(e.target.checked)}
                  />
                  Has Schema Markup
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hasOgTags}
                    onChange={(e) => setHasOgTags(e.target.checked)}
                  />
                  Has OG Tags
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hasCanonical}
                    onChange={(e) => setHasCanonical(e.target.checked)}
                  />
                  Has Canonical Tag
                </label>
              </div>
            </div>

            <button className="analyze-btn" onClick={handleAnalyze}>
              🔍 Analyze SEO
            </button>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && seoScore && (
          <div className="results-section">
            {/* SEO Score */}
            <div className="score-card">
              <div className={`score-circle ${seoScore.color}`}>
                <div className="score-number">{seoScore.total}</div>
                <div className="score-label">SEO Score</div>
              </div>
              <div className="score-status">
                <h3>Status: {seoScore.status.toUpperCase()}</h3>
                <p>
                  {seoScore.color === 'green'
                    ? '✅ Excellent SEO optimization'
                    : seoScore.color === 'orange'
                    ? '⚠️ Good, but can be improved'
                    : '❌ Needs significant improvement'}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="breakdown-section">
              <h3>Score Breakdown</h3>
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span>Title</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(seoScore.breakdown.title / 20) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score">{seoScore.breakdown.title}/20</span>
                </div>
                <div className="breakdown-item">
                  <span>Description</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(seoScore.breakdown.description / 20) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score">{seoScore.breakdown.description}/20</span>
                </div>
                <div className="breakdown-item">
                  <span>Readability</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(seoScore.breakdown.readability / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score">{seoScore.breakdown.readability}/10</span>
                </div>
                <div className="breakdown-item">
                  <span>Keyphrase</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(seoScore.breakdown.keyphrase / 16) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score">{seoScore.breakdown.keyphrase}/16</span>
                </div>
                <div className="breakdown-item">
                  <span>Images</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(seoScore.breakdown.images / 15) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score">{seoScore.breakdown.images}/15</span>
                </div>
                <div className="breakdown-item">
                  <span>Schema</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(seoScore.breakdown.schema / 15) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score">{seoScore.breakdown.schema}/15</span>
                </div>
              </div>
            </div>

            {/* Readability Metrics */}
            {readability && (
              <div className="metrics-section">
                <h3>📖 Readability Analysis</h3>
                <div className="metrics-grid">
                  <div className="metric">
                    <span>Flesch Score</span>
                    <strong>{readability.fleschScore}</strong>
                    <small>{readability.grade}</small>
                  </div>
                  <div className="metric">
                    <span>Passive Voice</span>
                    <strong>{readability.passiveVoicePct}%</strong>
                    <small>{readability.passiveVoicePct > 20 ? '⚠️ High' : '✅ Good'}</small>
                  </div>
                  <div className="metric">
                    <span>Avg Sentence Length</span>
                    <strong>{readability.avgSentenceLength}</strong>
                    <small>words</small>
                  </div>
                  <div className="metric">
                    <span>Total Words</span>
                    <strong>{readability.totalWords}</strong>
                    <small>in content</small>
                  </div>
                </div>
              </div>
            )}

            {/* Keyphrase Metrics */}
            {keyphrase && (
              <div className="metrics-section">
                <h3>🎯 Keyphrase Analysis</h3>
                <div className="metrics-grid">
                  <div className="metric">
                    <span>Keyphrase Density</span>
                    <strong>{keyphrase.density}%</strong>
                    <small>
                      {keyphrase.densityStatus === 'perfect'
                        ? '✅ Perfect (0.5-3%)'
                        : keyphrase.densityStatus === 'too_low'
                        ? '⬇️ Too Low'
                        : '⬆️ Too High (Stuffing)'}
                    </small>
                  </div>
                  <div className="metric">
                    <span>In Title</span>
                    <strong>{keyphrase.titlePresence ? '✅' : '❌'}</strong>
                  </div>
                  <div className="metric">
                    <span>In Description</span>
                    <strong>{keyphrase.descriptionPresence ? '✅' : '❌'}</strong>
                  </div>
                  <div className="metric">
                    <span>In H1</span>
                    <strong>{keyphrase.h1Presence ? '✅' : '❌'}</strong>
                  </div>
                  <div className="metric">
                    <span>In First 100 Words</span>
                    <strong>{keyphrase.firstHundredWordsPresence ? '✅' : '❌'}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {seoScore.recommendations.length > 0 && (
              <div className="recommendations-section">
                <h3>💡 Recommendations</h3>
                <ul>
                  {seoScore.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {activeTab === 'results' && !seoScore && (
          <div className="empty-state">
            <p>👈 Go to the Analyzer tab and click "Analyze SEO" to see results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
