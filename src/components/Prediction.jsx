import React from 'react'

export const Prediction = ({refs}) => {
  return (
    <div>
        <center>
                  <div ref={refs.copdRef} className="prog-box">
                    <div className="progress">
                      <div className="outer">
                        <div className="inner">
                          <div className="disease" style={{ paddingTop: "10px" }}>
                            <center>25%<p>COPD</p></center>
                          </div>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                        <defs>
                          <linearGradient id="GradientColor">
                            <stop offset="0%" stopColor="#DA22FF" />
                            <stop offset="100%" stopColor="#9733EE" />
                          </linearGradient>
                        </defs>
                        <circle cx="80" cy="80" r="70" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
  
                  <div ref={refs.asthmaRef} className="prog-box">
                    <div className="progress">
                      <div className="outer">
                        <div className="inner">
                          <div className="disease" style={{ paddingTop: "10px" }}>
                            <center>65%<p>Asthma</p></center>
                          </div>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                        <defs>
                          <linearGradient id="GradientColor">
                            <stop offset="0%" stopColor="#DA22FF" />
                            <stop offset="100%" stopColor="#9733EE" />
                          </linearGradient>
                        </defs>
                        <circle cx="80" cy="80" r="70" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
  
                  <div ref={refs.bronchitisRef} className="prog-box">
                    <div className="progress">
                      <div className="outer">
                        <div className="inner">
                          <div className="disease" style={{ paddingTop: "10px" }}>
                            <center>10%<p>Bronchitis</p></center>
                          </div>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                        <defs>
                          <linearGradient id="GradientColor">
                            <stop offset="0%" stopColor="#DA22FF" />
                            <stop offset="100%" stopColor="#9733EE" />
                          </linearGradient>
                        </defs>
                        <circle cx="80" cy="80" r="70" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </center>
    </div>
  )
}
