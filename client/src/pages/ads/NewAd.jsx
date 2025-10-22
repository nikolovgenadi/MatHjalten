import { useState } from "react";
import { useAds } from "../../hooks/useAds.js";

export default function NewAd() {
  const { addAd } = useAds();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    expiresAt: "",
    locationText: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // to validate file type
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setSelectedImage(file);
      } else {
        alert("Please select only JPEG or PNG images");
        e.target.value = "";
      }
    }
  };

  async function submit(e) {
    e.preventDefault();
    setMsg("loading...");

    // Debug: Check form data before sending
    console.log("Form data being sent:", form);
    console.log("Selected image:", selectedImage);

    const url = import.meta.env.PROD ? "/api/ads" : "http://localhost:8080/api/ads";

    // formData for file uploads
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("expiresAt", form.expiresAt);
    formData.append("locationText", form.locationText);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Server error:", res.status, data);
      return setMsg(data.error || `Error ${res.status}: ${data.message || "an error occured"}`);
    }

    // Check if we have the ad data
    if (!data.ad || !data.ad.id) {
      console.error("Unexpected response:", data);
      return setMsg("Ad created but couldn't redirect");
    }

    // Add the new ad to the global state
    addAd(data.ad);

    setMsg("Ad created successfully!");

    // Reset form
    setForm({
      title: "",
      description: "",
      category: "",
      expiresAt: "",
      locationText: "",
    });
    setSelectedImage(null);

    // Clear the message after a delay
    setTimeout(() => {
      setMsg("");
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-blue-700 p-4">
      <div className="max-w-2xl mx-auto">
        {/* header */}
        <div className="text-center pt-4 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Ad</h1>
          <p className="text-white">No food or drink should go to waste</p>
        </div>

        {/* form container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <form onSubmit={submit} className="p-8 space-y-6">
            {/* title */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                placeholder="e.g. Unopened Bananaskids"
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                          focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100
                          transition-all duration-300 shadow-inner hover:border-gray-300
                          placeholder-gray-400 text-gray-800"
              />
            </div>

            {/* description */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                placeholder="Describe the food/drink, quantity..."
                onChange={onChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                          focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100
                          transition-all duration-300 shadow-inner hover:border-gray-300
                          placeholder-gray-400 text-gray-800 resize-none"
              />
            </div>

            {/* category and date */}
            <div className="flex flex-wrap gap-4 items-end">
              <div className="group flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  required
                  className="w-32 px-2 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm
                            focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100
                            transition-all duration-300 shadow-inner hover:border-gray-300
                            text-gray-800 cursor-pointer"
                >
                  <option value="">Select category</option>
                  <option value="food">Food</option>
                  <option value="drink">Drink</option>
                </select>
              </div>

              <div className="group flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expires On</label>
                <input
                  type="date"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={onChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-40 px-2 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm
                            focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100
                            transition-all duration-300 shadow-inner hover:border-gray-300
                            text-gray-800"
                />
              </div>
            </div>

            {/* location */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup Location
              </label>
              <input
                type="text"
                name="locationText"
                value={form.locationText}
                placeholder="e.g. Stockholm, Sweden"
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                          focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100
                          transition-all duration-300 shadow-inner hover:border-gray-300
                          placeholder-gray-400 text-gray-800"
              />
            </div>

            {/* image upload */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png"
                onChange={onImageChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                          focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100
                          transition-all duration-300 shadow-inner hover:border-gray-300
                          text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                          file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
              />
              {selectedImage && (
                <p className="text-sm text-green-600 mt-1">Selected: {selectedImage.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Only JPEG and PNG files allowed. Max size: 5MB.
              </p>
            </div>

            {/* submit form */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!!msg && msg === "loading..."}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 
                          rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
              >
                {msg === "loading..." ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Ad...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">Create Ad</span>
                )}
              </button>
            </div>

            {/* status message */}
            {msg && msg !== "loading..." && (
              <div
                className={`mt-4 p-4 text-center font-medium ${
                  msg.includes("error") || msg.includes("failed")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
