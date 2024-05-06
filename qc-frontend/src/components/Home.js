import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [formData, setFormData] = useState({
    messageBody: "",
  });
  const { messageBody } = formData;
  const [errors, setErrors] = useState({});
  const messageBodyRef = useRef(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to the login page if token is not present
    }
  }, []);

  // Function to scroll to the bottom of the message body
  const scrollToBottom = () => {
    if (messageBodyRef.current) {
      messageBodyRef.current.scrollTop = messageBodyRef.current.scrollHeight;
    }
  };

  // Scroll to bottom on initial render and whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectedMessage = (messageId) => {
    setSelectedMessage(messageId);
  };

  const handleDeselect = () => {
    setSelectedMessage();
  };

  const token = localStorage.getItem("token");

  const handleEditClick = () => {
    // Find the message to edit from the messages state
    const messageToEdit = messages.find(
      (message) => message._id === selectedMessage
    );

    // If message to edit is found
    if (messageToEdit) {
      // Display a modal or form with the current message body for editing
      setFormData({ messageBody: messageToEdit.body });
    } else {
      console.error("Message not found for editing");
    }
  };

  const handleDeleteClick = async () => {
    try {
      handleClose();
      setIsMessagesLoading(true);
      // Make the delete request to the API
      await axios.delete(
        `http://localhost:5001/api/message/${selectedMessage}`
      );
      // Assuming the above URL is the correct endpoint for deleting a message
      setIsMessagesLoading(false);
      // Perform any additional actions after successful deletion
    } catch (error) {
      console.error("Error deleting message:", error);
      setIsMessagesLoading(false);
      // Handle error appropriately
    }
    handleDeselect();
  };

  const loggedInUser = localStorage.getItem("loggedInUser");


  // Sample student data
  const sampleStudents = [
    {
      id: 1,
      name: "John Doe",
      messages: [
        {
          body: "Hi there!",
          sentByCurrentUser: true,
          timestamp: "2024-05-01T08:00:00",
        },
        {
          body: "How can I help you?",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T08:05:00",
        },
        {
          body: "Sure, I can assist with that.",
          sentByCurrentUser: true,
          timestamp: "2024-05-01T08:10:00",
        },
        {
          body: "Let me know if you have any other questions.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T08:15:00",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      messages: [
        {
          body: "Hello!",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T09:00:00",
        },
        {
          body: "Yes, I'm available to answer questions.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T09:05:00",
        },
        {
          body: "What do you need help with?",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T09:10:00",
        },
        {
          body: "I'm glad I could help!",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T09:15:00",
        },
        {
          body: "Feel free to ask if anything else comes up.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T09:20:00",
        },
      ],
    },
    {
      id: 3,
      name: "Alice Johnson",
      messages: [
        {
          body: "Hey!",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T10:00:00",
        },
        {
          body: "I'm here to help.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T10:05:00",
        },
        {
          body: "Let me know what you're struggling with.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T10:10:00",
        },
        {
          body: "I'll do my best to explain it to you.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T10:15:00",
        },
        {
          body: "Don't hesitate to reach out if you need further assistance.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T10:20:00",
        },
      ],
    },
    {
      id: 4,
      name: "Bob Brown",
      messages: [
        {
          body: "Hi!",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T11:00:00",
        },
        {
          body: "I have a question about the last lecture.",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T11:05:00",
        },
        {
          body: "Could you clarify this concept for me?",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T11:10:00",
        },
        {
          body: "Thanks for explaining!",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T11:15:00",
        },
        {
          body: "I understand now, thanks!",
          sentByCurrentUser: false,
          timestamp: "2024-05-01T11:20:00",
        },
      ],
    },
    // Add more sample students as needed
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setStudents(sampleStudents);
        console.error("Error fetching students:", error);
      }
    };

    fetchUsers();
  }, [selectedStudent]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await fetch("http://localhost:5001/api/messages?", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data);
        console.log(data);
      } catch (error) {
        setMessages(sampleStudents);
        console.error("Error fetching messages:", error);
      }
    };

    fetchChat();
  }, [isMessagesLoading]);

  const handleStartMessaging = (student) => {
    setSelectedStudent(student);
  };

  const handleTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Add leading zero if needed
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
  };

  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsMessagesLoading(true);
      if (!selectedMessage) {
        await axios.post("http://localhost:5001/api/message", {
          sender: loggedInUser,
          receiver: selectedStudent?.email,
          body: messageBody,
        });
      } else {
        await axios.put(
          `http://localhost:5001/api/message/${selectedMessage}`,
          { body: formData.messageBody }
        );
      }
      handleDeselect();
      setIsMessagesLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        setErrors({ invalidCredentials: "Invalid email or password" });
      } else {
        setErrors({
          serverError: "An error occurred. Please try again later.",
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Row
        md={12}
        style={{
          paddingBottom: "40px",
          height: "50px",
          backgroundColor: "#007aff",
          display: "flex",
          alignItems: "center",
          color: "white",
          borderRadius: "10px",
          padding: "0px 20px",
        }}
      >
        <Col
          md="4"
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <h2>QuickChat</h2>
        </Col>
        <Col
          md="4"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h3>{loggedInUser}</h3>
        </Col>
        <Col
          md="4"
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link to="/">
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </Link>
        </Col>
      </Row>
      <Container>
        <Row>
          <Col
            style={{
              overflowY: "scroll",
            }}
            md={4}
          >
            {/* Student List */}

            {students
              ?.filter((student) => student?.email != loggedInUser)
              ?.map((student) => (
                <Card
                  key={student?.email}
                  className="mb-2"
                  onClick={() => handleStartMessaging(student)}
                >
                  <Card.Body
                    style={{
                      backgroundColor:
                        selectedStudent?._id == student?._id
                          ? "#007aff"
                          : "#FFF",
                      color:
                        selectedStudent?._id == student?._id ? "#FFF" : "#000",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "flex-end",
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontSize: "24px",
                        }}
                      >
                        <img
                          style={{
                            height: "40px",
                            width: "40px",
                            borderRadius: "50%",
                          }}
                          src="profile.webp"
                        />
                        {/* {student?.email?.charAt(0).toUpperCase()} */}
                      </div>
                      <div>{student?.username}</div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </Col>
          <Col
            style={{
              maxHeight: "350px",
            }}
            className="message-body-container"
            md={8}
          >
            <div
              style={{
                display: "flex",
                paddingBottom: "20px",
                justifyContent: "space-between",
              }}
            >
              <div>{selectedStudent?.username}</div>
            </div>

            {/* Message Body */}
            {!isMessagesLoading ? (
              <>
                {messages && selectedStudent ? (
                  <div>
                    <div ref={messageBodyRef} className="message-body">
                      {messages
                        .filter(
                          (message) =>
                            message.sender?.email == selectedStudent?.email ||
                            message.receiver?.email == selectedStudent?.email
                        )
                        .map((message, index) => (
                          <>
                            <div
                              className={`${
                                message.sender?.email == loggedInUser
                                  ? "mb-from-me"
                                  : "mb-from-them"
                              }`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <p
                                key={index}
                                onClick={() => {
                                  if (message?.sender?.email == loggedInUser)
                                    handleSelectedMessage(message?._id);
                                }}
                                className={`message-bubble ${
                                  message.sender?.email == loggedInUser
                                    ? "from-me"
                                    : "from-them"
                                }`}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span>{message.body}</span>
                                  </span>

                                  <span style={{ paddingLeft: "20px" }}>
                                    <svg
                                      fill="#FFF"
                                      height="10px"
                                      width="10px"
                                      version="1.1"
                                      id="Layer_1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 330 330"
                                    >
                                      <path
                                        id="XMLID_225_"
                                        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                                      />
                                    </svg>
                                  </span>
                                </div>
                                {selectedMessage &&
                                  selectedMessage == message?._id && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: "100%",
                                        backgroundColor: "gray",
                                        padding: "10px",
                                        zIndex: 100,
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                      }}
                                    >
                                      <div
                                        onClick={handleShow}
                                        style={{
                                          padding: "0.438rem 0.625rem",
                                        }}
                                      >
                                        Delete
                                      </div>
                                      <div
                                        onClick={() =>
                                          handleEditClick(message._id)
                                        }
                                        style={{
                                          padding: "0.438rem 0.625rem",
                                        }}
                                      >
                                        Edit
                                      </div>
                                    </div>
                                  )}
                              </p>

                              <span
                                style={{
                                  alignSelf: "flex-end",
                                  height: "40px",
                                  width: "40px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    message.sender.email == loggedInUser
                                      ? "blue"
                                      : "red",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  color: "white",
                                  fontSize: "24px",
                                }}
                              >
                                <img
                                  style={{
                                    height: "40px",
                                    width: "40px",
                                    borderRadius: "50%",
                                  }}
                                  src="profile.webp"
                                />
                                {/* {message?.sender?.email
                                  ?.charAt(0)
                                  .toUpperCase()} */}
                              </span>
                            </div>
                            <div
                              className={`${
                                message.sender?.email == loggedInUser
                                  ? "mb-from-me"
                                  : "mb-from-them"
                              }`}
                              style={{
                                paddingRight: "60px",
                                paddingBottom: "15px",
                                fontSize: "10px",
                              }}
                            >
                              {handleTimeStamp(message.timestamp)}
                            </div>
                          </>
                        ))}
                    </div>

                    <div class="send-box">
                      <form onSubmit={handleSubmit}>
                        <input
                          onChange={handleChange("messageBody")}
                          type="text"
                          name="messageBody"
                          class="form-control"
                          aria-label="message…"
                          value={messageBody}
                          placeholder="Write message…"
                        />

                        <button type="submit">
                          <i class="fa fa-paper-plane" aria-hidden="true"></i>{" "}
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <Row md={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      Click from the list of users to start chatting.
                    </div>
                  </Row>
                )}
              </>
            ) : (
              <>Loading</>
            )}
          </Col>
        </Row>
      </Container>
      <div
        style={{
          height: "40px",
          backgroundColor: "gray",
          alignItems: "center",
          color: "white",
          display: "flex",
          justifyContent: "center",
        }}
      >
        QuickChat 2024, inc.
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the message?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handleDeleteClick(selectedMessage)}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;
