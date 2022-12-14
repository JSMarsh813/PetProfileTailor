import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faFaceGrinWink, faUserTie } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'


const HeroTop= () => {
    
return (
<div className="hero min-h-fit font-serif  " style={{ backgroundImage: `url("https://img.buzzfeed.com/buzzfeed-static/static/2018-08/20/12/asset/buzzfeed-prod-web-03/anigif_sub-buzz-25459-1534782361-2.gif")`,
fontFamily:'Comfortaa'}}>
  <div className="hero-overlay bg-opacity-70"></div>
  <div className="hero-content text-center text-neutral-content mb-10">
    <div className="max-w-xl text-white">
      <h1 className="mb-5 text-5xl text-yellow-300 font-black"> Welcome to Pet Profile Tailor!</h1>
           <p className="mb-5 text-xl"> Creating engaging pet profiles to increase adoptions can feel ruff! We've been there! And we’re here to help.</p>
           <p className="mb-5 text-xl"> Pet profile tailor is a community powered assistant which assists you with creating pet profiles which are:</p>
     

        <section className="w-full flex justify-center gap-3">
                    <div ClassName="flex-1">
                        

                           <FontAwesomeIcon icon={faBullseye} className="text-4xl" color="yellow" />

                           <button className="btn btn-primary w-full mt-2 bg-yellow-300 text-violet-900 font-black text-lg">Impactful</button>
                    </div>

                    <div ClassName="flex-1">

                            <FontAwesomeIcon icon={faFaceGrinWink} className="text-4xl fa-bounce" color="yellow" />

                            <button className="btn btn-primary w-full mt-2 bg-yellow-300 text-violet-900 text-lg">Fun</button>
                    </div>

                    <div ClassName="flex-1">
                               <FontAwesomeIcon icon={faUserTie} className="text-4xl" color="yellow"/>
                               <button className="btn btn-primary w-full mt-2 bg-yellow-300  text-violet-900 text-lg">Tailor Fitted</button>
                    </div>
        </section>

    </div>
  </div>
</div>
)
}

export default HeroTop

