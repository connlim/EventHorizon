import Profile from "../pages/profile";
import { supabase } from "../utils/supabaseClient";

export default function Post({ idx, data }) {

    return (
        <div key={idx} style={{ position: 'relative', marginTop: '10px', border: '1px solid white', 
                        width: '1200px', height: '600px', textAlign: 'center'}}>
            <p style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)', fontSize: 'x-large'}}>
                Post Number: {idx} <br/>
                OP: {data.username} <br/>
                Content: {data.text} <br/>
                Latitude: {data.latitude} <br/>
                Longitude: {data.longitude} <br/>
                Upvotes: {data.upvotes} <br/>
                Downvotes: {data.downvotes} <br/>
                Score: {data.score}
            </p>
        </div>

    )
}