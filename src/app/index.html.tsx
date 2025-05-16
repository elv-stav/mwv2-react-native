import { Redirect } from "expo-router";

// Samsung TV web-apps slap "/index.html" on the end of the URL,
// so we need to handle that path and redirect it to the actual root path.
const RootRedirect = () => {
  return <Redirect href={"/"} />;
};

export default RootRedirect;
