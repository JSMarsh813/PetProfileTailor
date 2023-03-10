const getExtension = (imagefile) => {
  let parts = imagefile.name.split(".");
  return parts[parts.length - 1];
};

export const validateSize = (file) => {
  if (!file) return;
  if (file.size <= 5000000000) {
    return true;
  } else {
    return false;
  }
};

export const isImage = (imagefile) => {
  let ext = getExtension(imagefile);
  switch (ext.toLowerCase()) {
    case "jpg":
    case "gif":
    case "bmp":
    case "png":
    case "jpeg":
      return true;
  }
  return false;
};
