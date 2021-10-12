import React, { Component } from "react";
import "./meprofile.css";
import { Input } from 'antd';
import {
  Row,
  Col,
  Avatar,
  Tabs,
  Icon,
  Button,
  List,
  Empty,
  notification,
  Spin
} from "antd";
import { Link } from 'react-router-dom'
import ProfileModal from "./ProfileModal";
import FollowModal from "./FollowModal";
import {
  uploadImage,
  updateProfilePicture,
  getfollowersAndFollowing,
  getfollowers,
  getfollowing
} from "../../util/ApiUtil";
import PostGrid from "../../post/postgrid/PostGrid";
import { ACCESS_TOKEN } from "../../common/constants";

const TabPane = Tabs.TabPane;

class EditProfile extends Component {
  state = {
    settingModalVisible: false,
    profilePicModalVisible: false,
    profilePicUploading: false,
    followersModalVisible: false,
    followingModalVisible: false,
    followers: 0,
    following: 0,
    currentUser: { ...this.props.currentUser }
  };

  componentDidMount = () => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      this.props.history.push("/login");
    }

    this.getfollowersAndFollowing(this.state.currentUser.username);
  };

  getfollowersAndFollowing = username => {
    getfollowersAndFollowing(username).then(response =>
      this.setState({
        followers: response.inDegree,
        following: response.outDegree
      })
    );
  };

  showSettingModal = () => {
    this.setState({ settingModalVisible: true });
  };

  hideSettingModal = () => {
    this.setState({ settingModalVisible: false });
  };

  handleLogout = () => {
    this.setState({ settingModalVisible: false });
    this.props.onLogout();
  };

  showProfilePicModal = () => {
    this.setState({ profilePicModalVisible: true });
  };

  hideProfilePicModal = () => {
    this.setState({ profilePicModalVisible: false });
  };

  handleUpload = file => {
    this.setState({ profilePicUploading: true });
    this.hideProfilePicModal();

    const data = new FormData();
    data.append("image", file);

    uploadImage(data)
      .then(response => {
        updateProfilePicture(response.uri)
          .then(res => {
            let currentUser = { ...this.state.currentUser };
            currentUser.profilePicture = response.uri;

            this.setState({
              currentUser: { ...currentUser }
            });

            this.props.onUpdateCurrentUser(currentUser);

            notification.success({
              message: "CriptoGram",
              description: "Profile picture updated"
            });
          })
          .catch(error => {
            notification.error({
              message: "CriptoGram",
              description: "Something went wrong. Please try again!"
            });
          });
      })
      .catch(error => {
        notification.error({
          message: "CriptoGram",
          description:
            error.message || "Something went wrong. Please try again!"
        });
      });

    this.setState({ profilePicUploading: false });
  };

  handleFollowersClick = () => {
    if (this.state.followers > 0) {
      getfollowers(this.state.currentUser.username).then(response =>
        this.setState({ followerList: response, followersModalVisible: true })
      );
    }
  };

  handleFollowingClick = () => {
    if (this.state.following > 0) {
      getfollowing(this.state.currentUser.username).then(response =>
        this.setState({ followingList: response, followingModalVisible: true })
      );
    }
  };

  handleFollowersCancel = () => {
    this.setState({ followersModalVisible: false, followerList: [] });
  };

  handleFollowingCancel = () => {
    this.setState({ followingModalVisible: false, followingList: [] });
  };

  handleOnItemClick = username => {
    this.props.history.push("/users/" + username);
  };

  render() {
    let numOfPosts = 0;

    if (Array.isArray(this.props.posts)) {
      numOfPosts = this.props.posts.length;
    }

    return (
      <div className="profile-container">
        <Row>
          <Col span={24}>
            <div className="user-details ant-card">
              <Row>
                <Col span={8}>
                  <div className="user-avatar">
                    <Spin
                      spinning={this.state.profilePicUploading}
                      tip="Uploading..."
                    >
                      <Avatar
                        src={this.state.currentUser.profilePicture}
                        className="user-avatar-circle"
                        onClick={this.showProfilePicModal}
                      />
                    </Spin>
                  </div>
                </Col>
                <Col span={16}>
                  <Row>
                    <Col span={9}>
                      <h1 className="username">
                        {this.state.currentUser.username}
                      </h1>
                    </Col>
                    <Col span={4}>
                      <Link to={`/users/me`} className="edit-profile">Save profile</Link>
                    </Col>
                  </Row>
                  
                  <Row>
                    <h2>Name</h2><Input value={this.state.currentUser.username} className="name"></Input>
                  </Row> 
                  <Row>
                    <h2>Bio</h2><Input value={this.state.currentUser.username} className="name"></Input>
                  </Row>
                  <Row>
                    <h2>Site</h2><Input value={this.state.currentUser.username} className="name"></Input>
                  </Row>
                  <Row>
                    <h2>Phone</h2><Input value={this.state.currentUser.username} className="name"></Input>
                  </Row> 
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <ProfileModal
          visible={this.state.profilePicModalVisible}
          title="Change profile photo"
          dataSource={[
            {
              onClick: null,
              text: "Upload Photo",
              isUpload: true,
              onUpload: this.handleUpload
            },
            { onClick: this.hideProfilePicModal, text: "Cancel" }
          ]}
        />
        
      </div>
    );
  }
}

export default EditProfile;
