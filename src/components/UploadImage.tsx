"use client";
import { FormEventHandler, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { vectorize } from "@cloudinary/url-gen/actions/effect";
import Image from "next/image";

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

export function UploadImage() {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("idle");
  const [data, setData] = useState<any>(null);

  const handleUpload = async (base64data: string | ArrayBuffer | null) => {
    setUploadStatus("uploading");
    if (base64data) {
      const formData = new FormData();
      formData.append("file", base64data as string);
      formData.append("upload_preset", "to_svg_demo");
      formData.append("filename_override", "test.svg");
      formData.append("tags", "to_svg_demo");

      const uploadedImage = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then(res => res.json())
        .then(res => res.public_id);

      const url = cld.image(uploadedImage);
      url.format("svg");
      url.effect(vectorize().numOfColors(2).detailsLevel(600));

      setData(url.toURL());
    }

    setUploadStatus("idle");
  };

  const setUpload = (
    reader: FileReader,
    cb: (val: string | ArrayBuffer | null) => void
  ) => {
    reader.onloadend = () => {
      const base64data = reader.result;
      cb(base64data);
    };
  };

  const handleChange: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement)?.files?.[0];

    if (!file) {
      return;
    }
    reader.readAsDataURL(file);
    setUpload(reader, setImage);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const reader = new FileReader();
    const file = (event.target as HTMLFormElement)?.logo?.files?.[0];

    if (!file) {
      return;
    }

    reader.readAsDataURL(file);
    setUpload(reader, (result: string | ArrayBuffer | null) => {
      setImage(result), handleUpload(result);
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <form
        className="max-w-lg flex flex-col gap-3"
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="logo"
          >
            Upload Image
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="logo_help"
            id="logo"
            type="file"
          />
          <div
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            id="logo_help"
          >
            Upload a simple, low-res image to turn into svg
          </div>
        </div>
        <button
          type="submit"
          disabled={!image || uploadStatus === "uploading"}
          className="text-violet-700 hover:text-white border border-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-violet-500 dark:text-violet-500 dark:hover:text-white dark:hover:bg-violet-500 dark:focus:ring-violet-800"
        >
          Upload
        </button>
      </form>

      {image ? (
        <>
          <h2 className="text-2xl">Upload Image Preview</h2>
          <div className="flex gap-3 w-full">
            <div>
              <p>Actual Size</p>
              <Image
                src={image.toString()}
                width={100}
                height={100}
                alt="preview"
              />
            </div>
            <div>
              <p>Higher Width + Height (shows pixelation)</p>
              <Image
                src={image.toString()}
                alt="preview"
                width={400}
                height={400}
              />
            </div>
          </div>
        </>
      ) : null}

      {uploadStatus === "uploading" && <div>Uploading...</div>}

      {data && (
        <>
          <h2 className="text-2xl">SVG Image</h2>
          <div className="flex gap-3 w-full">
            <div>
              <p>Actual Size</p>
              <Image
                src={data.toString()}
                width={100}
                height={100}
                alt="preview"
              />
            </div>
            <div>
              <p>Higher Width + Height</p>
              <Image
                src={data.toString()}
                alt="preview"
                width={700}
                height={700}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
