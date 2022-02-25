import React from "react";

const Form = ({ description, handleChange, createImage, handleFileChange }) => {
  return (
    <div className="container w-50 mx-auto my-3">
      <div className="card card-body p-2 bg-light">
        <h6 className="mb-2">Share Image</h6>
        <textarea
          name="description"
          placeholder="Image Description"
          aria-label="hidden"
          className="mb-2 form-control"
          value={description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="file"
          aria-label="hidden"
          name="images"
          className="mb-2"
          accept=".jpg ,.jpeg, .png, .gif"
          onChange={handleFileChange}
          required
        />
        <button className="btn btn-primary btn-block" onClick={createImage}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default Form;
