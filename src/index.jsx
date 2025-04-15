import { Canvas } from "@react-three/fiber";
import ReactDOM from "react-dom/client";
import Experience from "./Experience.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Canvas>
      <Experience />
    </Canvas>
  </>
);
