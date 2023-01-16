import dynamic from "next/dynamic";

const FocusGraphWrapped = dynamic(() => import("./FocusGraph"), {
  ssr: false
});

export default FocusGraphWrapped;
