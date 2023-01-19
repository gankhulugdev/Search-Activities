import { Layout, Input, Row, Col, Tag } from "antd";
import React, { useEffect, useRef, useState, useContext, memo } from "react";
import { MapBoxContext } from ".";
import { TweenOneGroup } from "rc-tween-one";

const { Header } = Layout;
const SearchField = () => {
  const {setParams, fetchActivityData } = useContext(MapBoxContext)

  // call Fetch API
  const onFinish = () => fetchActivityData();

  const [tags, setTags] = useState(
    localStorage.getItem("tags") ? JSON.parse(localStorage.getItem("tags")) : []
  );

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  //Focus on input field
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  //update params.query
  useEffect(() => {
    setParams((curr) => ({ ...curr, query: tags.join(" ") }));

    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags,setParams]);

  // Close tag
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };
  // Add tag
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Header
    className=""
      style={{
        height: "30%",
        backgroundImage: "url(https://wallpapercave.com/wp/wp6045025.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Row>
        <Col
        className="flex items-center flex-wrap mt-4"
          xs={{
            span: 22,
            offset: 2,
          }}
          lg={{
            span: 23,
            offset: 1,
          }}
        >
          <TweenOneGroup          
            className="leading-4 font-bold"
            enter={{
              scale: 0.8,
              opacity: 0,
              type: "from",
              duration: 400,
            }}
            onEnd={(e) => {
              if (e.type === "appear" || e.type === "enter") {
                e.target.style =
                  "display: inline-block; color: white; background-color: #27212145; line-height: 22px; margin: 0 15px 0 0";
              }
            }}
            leave={{
              opacity: 0,
              width: 0,
              scale: 0,
              duration: 500,
            }}
            appear={false}
          >
            {tags.map((tag, id) => (
              <Tag
                key={id}
                style={{ color: "white", backgroundColor: '#27212145'}}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleClose(tag);
                }}
              >
                {tag}
              </Tag>
            ))}
          </TweenOneGroup>

          {
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{
                width: 78,
                height: 22,
              }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          }
        </Col>
      </Row>
          <div className="flex justify-center ">
          <button onClick={onFinish} className="absolute bottom-3/4 flex w-40 justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-400">
            Find activity
          </button>
          </div>
      
    </Header>
  );
};

export default memo(SearchField);
