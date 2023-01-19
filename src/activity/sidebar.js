import React, { memo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Drawer,FloatButton, Card } from "antd";
import { MdOutlineFavorite } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { SiCircle } from "react-icons/si";
import { FaGlobeAmericas } from "react-icons/fa";
import {GiHamburgerMenu} from "react-icons/gi"
import { MapBoxContext } from ".";

const SideBar = () => {
  const navigate = useNavigate();
  const {favoriteActivities} = useContext(MapBoxContext)

  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  return (
    <div>
      <button  className="absolute top-0 text-3xl text-white border-slate-100 outline-2 p-2 hover:bg-neutral-300" onClick={showDrawer}>
        <GiHamburgerMenu/>
      </button>

      <Drawer
      bodyStyle={{padding: "0px", backgroundColor: '#001529'}}
        placement={"left"}
        width={200}
        onClose={onClose}
        open={open}
      >
        <Menu
          onClick={({ key }) => {
            navigate(key);
          }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/"]}
          items={[
            {
              label: "Search",
              key: "/search",
              icon: <BsSearch />,
              children: [
                { label: "by states", key: "/", icon: <FaGlobeAmericas /> },
                {
                  label: "by  radius",
                  key: "/searchByRadius",
                  icon: <SiCircle />,
                },
              ],
            },
            {
              label: "Favorite",
              key: "/favorite",
              icon: <MdOutlineFavorite />,
              children: favoriteActivities.map((activity)=>{
                  return {label: activity.assetName,
                  key: activity.assetGuid}
                })


              
              
            },
          ]}
        />
      </Drawer>

      
    </div>
  );
};

export default memo(SideBar);
