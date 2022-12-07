import CategoryFeatures from '../../components/categoryFeatures'


//Special jsx code that allows us to build links. Allows us to keep everything on a single page, rather than using href="page link", which would make us lose any state and require that we get a new file sent from the server
function namesHomePage() {
  return <div>
           
    This is the names homepage!Does this change, yes it does

    <CategoryFeatures/>
  
  
  </div>
}

export default namesHomePage
// must export homepage so nextJs knows where to find it