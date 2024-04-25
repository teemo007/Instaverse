import styles from "./styles";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Divider, List, Button, Form, Input, Space } from "antd";

const { TextArea } = Input;

const Commnet = ({ setShowComment }) => {
  const handleOutsideClick = (e) => {
    e.stopPropagation();
  };
  const data = [
    "Racing car sprays burning fuel into crowd.",
    "Japanese princess to wed commoner.",
    "Australian walks 100km after outback crash.",
    "Man charged over missing wedding girl.",
    "Los Angeles battles huge wildfires.",
  ];
  return (
    <div style={styles.commentOverlay} onClick={() => setShowComment(false)}>
      <div style={styles.commentContent} onClick={handleOutsideClick}>
        <CloseCircleOutlined
          style={styles.exitComment}
          onClick={() => setShowComment(false)}
        />
        <Divider orientation="center">Comments</Divider>
        <List
          size="small"
          // header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          dataSource={data}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
        <div /* style={{ backgroundColor: "red" }} */>
          <Form
            name="wrap"
            labelAlign="left"
            labelWrap
            wrapperCol={{
              flex: 1,
            }}
            colon={false}
            style={{
              maxWidth: 600,
            }}
          >
            <Space.Compact
              style={{
                width: "100%",
                
              }}
            >
              <TextArea
                placeholder="Add a comment for xxx"
                autoSize={{ minRows: 1, maxRows: 4 }}
              />
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space.Compact>

            {/* <Form.Item label=" ">
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Form.Item> */}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Commnet;
