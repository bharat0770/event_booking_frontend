const HomePage = () => {
  
  if(!localStorage.getItem("testUser")){
      window.location.href = "/login"
    }
  return <h1 className="lg:px-40">Home Page</h1>
}
export default HomePage; 