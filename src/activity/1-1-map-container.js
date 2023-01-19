import { Layout } from "antd"
import SearchField from "./searchField";
import MapByStates from "./1-3-map-by-states";
const { Content } = Layout;

const MapContainer = ()=>{
    return <Layout>
   <SearchField/>
    <Content>
      <div
        style={{
          minHeight: 360,
          height: "70vh",
          width: "100%"
        }}
      >
        <MapByStates />
      </div>
    </Content>
  </Layout>
}

export default MapContainer