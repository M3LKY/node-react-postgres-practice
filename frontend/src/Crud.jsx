import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Crud = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getTodoBaseOnId(id);
    }
  }, [id]);
  const getTodoBaseOnId = (id) => {
    return (async () => {
      try {
        const response = await fetch(`http://localhost:3000/get/${id}`);
        const data = await response.json();
        setName(data.newTodo.name);
        setDescription(data.newTodo.description);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const setCreateTodo = () => {
    return (async () => {
      try {
        if (name === "" || description === "") {
          console.log("SetCreateTodo: Name or description cannot be empty");
          return;
        }

        const response = await fetch(`http://localhost:3000/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            description: description,
          }),
        });

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const updateTodo = () => {
    return (async () => {
      try {
        const response = await fetch(`http://localhost:3000/put/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            name: name,
            description: description,
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  };
  const deleteTodo = () => {
    return (async () => {
      try {
        const response = await fetch(`http://localhost:3000/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!id) {
      if (!name || !description) {
        // If either name or description is empty, do not proceed with submission.
        console.log("HandleSubmit: Name and description cannot be empty");
        return;
      }
      setIsSubmitting(true); // Disable the button during the submission process.

      setCreateTodo().then(() => {
        setIsSubmitting(false); // Re-enable the button after the submission is complete.
        navigate("/");
      });
    } else {
      updateTodo().then(() => {
        setIsSubmitting(false); // Re-enable the button after the submission is complete.
        navigate("/");
      });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          required
        />
        <br />
        <br />
        <textarea
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          required
        />
        <br />
        <br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={() => {
            deleteTodo().then(() => {
              navigate("/");
            });
          }}
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default Crud;
