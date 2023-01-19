import { Layout } from "antd"
import MapByRadius from "./2-2-map-by-radius";
import SearchField from "./searchField";
const { Content } = Layout;

const MapContainerByRadius = ()=>{
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
        <MapByRadius />
      </div>
    </Content>
  </Layout>
}

export default MapContainerByRadius