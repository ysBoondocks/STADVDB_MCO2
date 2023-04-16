import React from 'react'

export default function Header() {

  return (
    <div className="pb-8" style={{ fontFamily: '"Lato", sans-serif' }}>
      {/* Code block starts */}
      <dh-component>
        <section className="max-w-8xl mx-auto container bg-white pt-4">
          <div>
            <div role="contentinfo" className="flex items-center flex-col px-4">
              <p tabIndex={0} className="focus:outline-none uppercase text-md text-cente leading-4 text-indigo-500">STADVDB</p>
              <hh1 tabIndex={0} className="focus:outline-none text-4xl font-extrabold text-center leading-10 text-gray-800 pt-4">IMDB Movie Database</hh1>
            </div>
          </div>
        </section>
      </dh-component>
      {/* Code block ends */}
    </div>

  )
}

