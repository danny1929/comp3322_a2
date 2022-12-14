import "./App.css";
import React from "react";

function Header() {
  return (
    <header>
      <h1>iNotes</h1>
    </header>
  );
}

function LoginControl(props) {
  function handleLoginClick(e) {
    e.preventDefault();
    var name = document.getElementById("login_name").value;
    var password = document.getElementById("login_pwd").value;
    props.handleLoginClick(name, password);
  }

  return (
    <div className="login">
      {!props.isLoggedIn ? (
        <div>
          <p>{props.isLoggedIn}</p>
          <div className="signin_block">
            <p>Username </p>
            <input
              id="login_name"
              type="text"
              required="required"
              name="name"
            />
          </div>
          <div className="signin_block">
            <p>Password </p>
            <input
              id="login_pwd"
              type="password"
              required="required"
              name="password"
            />
          </div>
          <div className="login_action">
            <button onClick={handleLoginClick}>Sign in</button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function LoginProfile(props) {
  if (props.data !== "") {
    var profile = JSON.parse(props.data);
  }
  function handleLogoutClick(e) {
    e.preventDefault();
    if (window.confirm("Are you sure to quit editing the note and log out?")) {
      props.handleLogoutClick();
    }
  }
  return (
    <div>
      {props.data !== "" && props.isLoggedIn == true ? (
        <div className="login_panel">
          <div className="login_profile">
            <img
              id="icon"
              src={"http://localhost:3001/" + profile.icon}
              alt="profile"
            />

            <p id="user">{profile.name}</p>
          </div>
          <div className="logout_action">
            <button id="logoutButton" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function NotesLayout(props) {
  function handleShowNote(e) {
    e.preventDefault();
    props.handleShowNote(e.target.id);
  }

  function handleSearchNote(e) {
    e.preventDefault();
    if (e.key == "Enter") {
      props.handleSearchNote(e.target.value);
    }
  }

  if (props.data !== "") {
    var profile = JSON.parse(props.data);

    return (
      <div id="category">
        {props.data !== "" ? (
          <div>
            <input
              id="searchButton"
              type="search"
              placeholder="Search..."
              onKeyUp={handleSearchNote}
            />
            <h1 id="noteBrief">{"Notes (" + profile.notes.length + ")"}</h1>
            <ul>
              {profile.notes.map((note) => (
                <li
                  id={note._id}
                  onClick={handleShowNote}
                  className="list-group-item"
                  key={note._id}
                >
                  {note.title}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

function ContentsLayout(props) {
  function handleAddNote(e) {
    e.preventDefault();
    var newTitle = document.getElementById("newNoteTitle").value;
    var newContent = document.getElementById("newNoteContent").value;
    props.handleAddNote(newTitle, newContent);
  }
  function handleSaveNote(e) {
    e.preventDefault();
    var updateTitle = document.getElementById("existNoteTitle").value;
    var updateContent = document.getElementById("existNoteContent").value;
    var noteId = document.getElementById("existNoteTitle").name;
    props.handleSaveNote(noteId, updateTitle, updateContent);
  }
  function cancelAddNote(e) {
    e.preventDefault();
    if (window.confirm("Are you sure to quit editing the note?")) {
      document.getElementById("addNote").style.display = "none";
      document.getElementById("editNote").style.display = "block";
      document.getElementById("editNote").style.visibility = "hidden";
      document.getElementById("add_box").style.display = "block";
    }
  }
  function cancelSaveNote(e) {
    e.preventDefault();
    if (window.confirm("Are you sure to quit editing the note?")) {
      document.getElementById("save").style.display = "none";
      document.getElementById("cancel").style.display = "none";
      document.getElementById("editNote").style.display = "block";
      document.getElementById("delete").style.display = "block";
      document.getElementById("contentTime").style.display = "block";
      document.getElementById("addNote").style.display = "none";
      document.getElementById("editSaveButton").style.display = "none";
      document.getElementById("editCancelButton").style.display = "none";
      document.getElementById("add_box").style.display = "block";
    }
  }
  function handleDeleteNote(e) {
    e.preventDefault();
    if (window.confirm("Confirm to delete this note?")) {
      var titleId = document.getElementById("existNoteTitle").name;
      props.handleDeleteNote(titleId);
    }
  }

  function addNewNote(e) {
    e.preventDefault();
    document.getElementById("addNote").style.display = "block";
    document.getElementById("editCancelButton").style.display = "block";

    document.getElementById("editNote").style.display = "none";
    document.getElementById("save").style.display = "block";
    document.getElementById("cancel").style.display = "block";
    document.getElementById("newNoteTitle").value = "";
    document.getElementById("newNoteContent").value = "";

    document.getElementById("add_box").style.display = "none";
  }

  if (props.data !== "") {
    return (
      <div id="contents">
        <div id="editNote">
          {" "}
          <div id="displaySection">
            <div id="contentTime"></div>
            <div id="editButton">
              <button id="editCancelButton" onClick={cancelSaveNote}>
                Cancel
              </button>
              <button id="editSaveButton" onClick={handleSaveNote}>
                Save
              </button>
              <button id="delete" onClick={handleDeleteNote}>
                Delete
              </button>
            </div>
          </div>
          <div>
            <input id="existNoteTitle" type="text" placeholder="title" />
            <textarea id="existNoteContent" type="text" placeholder="content" />
          </div>
        </div>
        <div id="addNote">
          <div id="addButton">
            <button id="cancel" onClick={cancelAddNote}>
              Cancel
            </button>
            <button id="save" onClick={handleAddNote}>
              Save
            </button>
          </div>
          <div>
            <input id="newNoteTitle" type="text" placeholder="Note title" />
            <textarea
              id="newNoteContent"
              type="text"
              placeholder="Note content"
            />
          </div>
        </div>
        <button id="add_box" onClick={addNewNote}>
          +
        </button>
      </div>
    );
  }
}

class iNoteApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      data: "",
    };
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleShowNote = this.handleShowNote.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
    this.displayUpdateButton = this.displayUpdateButton.bind(this);
    this.handleSaveNote = this.handleSaveNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleSearchNote = this.handleSearchNote.bind(this);
  }

  handleLoginClick(name, password) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, password: password }),
      withCredentials: true,
      credentials: "include",
    };
    fetch("http://localhost:3001/signin", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.msg == "Login failure") {
          alert(data.msg);
        } else {
          this.setState({ isLoggedIn: true });

          for (var i = 0; i < data.notes.length; i++) {
            data.notes[i].lastsavedtime = this.string_to_time(
              data.notes[i].lastsavedtime
            );
          }
          data.notes.sort((a, b) => b.lastsavedtime - a.lastsavedtime);
          this.setState({ data: JSON.stringify(data) });
        }
      });
  }

  handleLogoutClick() {
    const requestOptions = {
      withCredentials: true,
      credentials: "include",
    };
    fetch("http://localhost:3001/logout", requestOptions).then((response) => {
      this.setState({ isLoggedIn: false, data: "" });
      document.getElementById("contents").style.display = "none";
    });
  }

  handleShowNote(_id) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    };
    fetch("http://localhost:3001/getnote?noteid=" + _id, requestOptions)
      .then((response) => response.json())
      .then((jsondata) => {
        document.getElementById("delete").style.display = "block";
        document.getElementById("contentTime").style.display = "block";

        document.getElementById("contentTime").innerHTML =
          "Last saved: " + jsondata[0].lastsavedtime;
        document.getElementById("editNote").style.visibility = "initial";
        var title = document.getElementById("existNoteTitle");
        var content = document.getElementById("existNoteContent");
        title.name = _id;
        title.value = jsondata[0].title;
        content.value = jsondata[0].content;
        title.style.display = "block";
        content.style.display = "block";
        title.onclick = this.displayUpdateButton;
        content.onclick = this.displayUpdateButton;
        document.getElementById("add_box").style.display = "block";
        document.getElementById("editNote").style.display = "block";
        document.getElementById("editCancelButton").style.display = "none";
        document.getElementById("editSaveButton").style.display = "none";
        document.getElementById("addNote").style.display = "none";

        [...document.querySelectorAll(".list-group-item")].forEach((item) => {
          var getElementWithClass = document.querySelector(".active");
          if (getElementWithClass !== null)
            getElementWithClass.classList.remove("active");
          document.getElementById(_id).classList.add("active");
        });
      });
  }

  handleAddNote(title, content) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, content: content }),
      withCredentials: true,
      credentials: "include",
    };
    fetch("http://localhost:3001/addnote", requestOptions)
      .then((response) => response.json())
      .then((jsondata) => {
        jsondata.lastsavedtime = this.string_to_time(jsondata.lastsavedtime);

        var newNotesState = JSON.parse(this.state.data);
        var newNote = {
          lastsavedtime: jsondata.lastsavedtime,
          title: title,
          _id: jsondata._id,
        };
        newNotesState.notes.unshift(newNote);
        this.setState({
          data: JSON.stringify(newNotesState),
        });
        this.handleShowNote(jsondata._id);
      });
  }

  handleSaveNote(_id, title, content) {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, content: content }),
      withCredentials: true,
      credentials: "include",
    };
    fetch("http://localhost:3001/savenote/" + _id, requestOptions)
      .then((response) => response.json())
      .then((jsondata) => {
        document.getElementById("contentTime").innerHTML =
          "Last saved: " + jsondata.lastsavedtime;
        document.getElementById("editSaveButton").style.display = "none";
        document.getElementById("editCancelButton").style.display = "none";
        document.getElementById("delete").style.display = "block";
        document.getElementById("contentTime").style.display = "block";
        document.getElementById("add_box").style.display = "block";

        jsondata.lastsavedtime = this.string_to_time(jsondata.lastsavedtime);
        var newNotesState = JSON.parse(this.state.data);
        for (var i = 0; i < newNotesState.notes.length; i++) {
          if (newNotesState.notes[i]._id == _id) {
            var itemToUpdate = {
              lastsavedtime: jsondata.lastsavedtime,
              title: title,
              _id: _id,
            };
            newNotesState.notes.splice(i, 1);
            newNotesState.notes.unshift(itemToUpdate);
          }
        }
        this.setState({
          data: JSON.stringify(newNotesState),
        });
      })

      //condition that if there is input in search
      .then(() => {
        var searchStr = document.getElementById("searchButton").value;
        this.handleSearchNote(searchStr);
      });
  }

  handleDeleteNote(_id) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    };
    fetch("http://localhost:3001/deletenote/" + _id, requestOptions)
      .then((response) => response.json())
      .then((jsondata) => {
        document.getElementById("editNote").style.visibility = "hidden";

        var newNotesState = JSON.parse(this.state.data);
        for (var i = 0; i < newNotesState.notes.length; i++) {
          if (newNotesState.notes[i]._id == _id)
            newNotesState.notes.splice(i, 1);
        }
        document.getElementById("noteBrief").innerHTML =
          "Notes (" + newNotesState.notes.length + ")";
        this.setState({
          data: JSON.stringify(newNotesState),
        });
      });
  }

  handleSearchNote(searchstr) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    };
    fetch(
      "http://localhost:3001/searchnotes?searchstr=" + searchstr,
      requestOptions
    )
      .then((response) => response.json())
      .then((jsondata) => {
        var newNotesState = JSON.parse(this.state.data);

        newNotesState.notes = jsondata;

        for (var i = 0; i < jsondata.length; i++) {
          jsondata[i].lastsavedtime = this.string_to_time(
            jsondata[i].lastsavedtime
          );
        }
        jsondata.sort((a, b) => b.lastsavedtime - a.lastsavedtime);
        this.setState({
          data: JSON.stringify(newNotesState),
        });
      });
  }

  string_to_time(str) {
    return new Date(
      str
        .split(" ")
        .slice(1)
        .join(" ") +
        " " +
        str.split(" ")[0]
    );
  }

  displayUpdateButton(e) {
    e.preventDefault();
    document.getElementById("add_box").style.display = "none";
    document.getElementById("delete").style.display = "none";
    document.getElementById("contentTime").style.display = "none";

    document.getElementById("save").style.display = "none";
    document.getElementById("cancel").style.display = "none";
    document.getElementById("editCancelButton").style.display = "block";
    document.getElementById("editSaveButton").style.display = "block";
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <section className="contents">
          <LoginControl
            isLoggedIn={this.state.isLoggedIn}
            handleLoginClick={this.handleLoginClick}
          />
          <LoginProfile
            data={this.state.data}
            isLoggedIn={this.state.isLoggedIn}
            handleLogoutClick={this.handleLogoutClick}
          />
          <NotesLayout
            data={this.state.data}
            handleShowNote={this.handleShowNote}
            handleSearchNote={this.handleSearchNote}
          />
          <ContentsLayout
            data={this.state.data}
            handleAddNote={this.handleAddNote}
            handleSaveNote={this.handleSaveNote}
            handleDeleteNote={this.handleDeleteNote}
          />
        </section>
      </React.Fragment>
    );
  }
}

export default iNoteApp;
