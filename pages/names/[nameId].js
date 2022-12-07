import CategoryFeatures from '../../components/categoryFeatures'
import NavBar from '../../components/NavBar'
import {useRouter} from 'next/router'
// [nameId] is a dynamic page


function nameDetails() {

  const router=useRouter();
  const nameId= console.log(router.query.nameId)
  //https://www.youtube.com/watch?v=MFuwkrseXVE&ab_channel=Academind 41:25 why console.log shows undefined then the nameId value, runs immediately when the page first renders and then reloads, just how the hook works

  //send a request to the backend API
  // to fetch the news item with newsID
  
  return <div>
   
   <p>This is the details for one specific name!</p>
  </div>
}

export default nameDetails
// must export homepage so nextJs knows where to find it
