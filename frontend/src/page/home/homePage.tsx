import React from 'react'
import NavBar from '../../components/navBar'
import {getProfile} from './action'
import {useAuth} from "../../components/AuthContext";

function  HomePage() {
  const { accessToken } = useAuth();
  const [profiles, setProfiles] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (accessToken) {
          const data = await getProfile({}, accessToken);
          console.log("Fetched profiles:", data);
          setProfiles(data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [accessToken]);

  return (
    <div className='grid grid-cols-[1fr_2fr_1fr]'>
      <NavBar data={profiles[0]} />
      <div>HomePage</div>
      <div>Right</div>
    </div>
  )
}

export default HomePage