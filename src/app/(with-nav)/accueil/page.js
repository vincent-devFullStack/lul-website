"use client";
import Image from "next/image";

export default function AccueilPlanInteractif() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "72rem",
        margin: "0 auto",
        height: "600px",
      }}
    >
      <Image
        src="/assets/plan.webp"
        alt="Plan du musée"
        fill
        style={{ objectFit: "contain" }}
        priority
      />

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "20%",
          left: "3%",
          width: "16%",
          height: "24%",
        }}
        onClick={() => alert("Salle 1")}
        aria-label="Salle 1"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 1");
        }}
      >
        Salle 1
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "22%",
          left: "44%",
          width: "17%",
          height: "22%",
        }}
        onClick={() => alert("Salle 2")}
        aria-label="Salle 2"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 2");
        }}
      >
        Salle 2
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "51%",
          left: "44%",
          width: "10%",
          height: "22%",
        }}
        onClick={() => alert("Salle 3")}
        aria-label="Salle 3"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 3");
        }}
      >
        Salle 3
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "75%",
          left: "44%",
          width: "10%",
          height: "22%",
        }}
        onClick={() => alert("Salle 4")}
        aria-label="Salle 4"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 4");
        }}
      >
        Salle 4
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "21%",
          left: "20%",
          width: "3%",
          height: "25%",
        }}
        aria-label="Salle 5"
        role="button"
        tabIndex={0}
        onClick={() => alert("Salle 5")}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 5");
        }}
      >
        S. 5
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "47%",
          left: "3%",
          width: "8%",
          height: "15%",
        }}
        onClick={() => alert("Salle 6")}
        aria-label="Salle 6"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 6");
        }}
      >
        Salle 6
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "56%",
          left: "36%",
          width: "7%",
          height: "30%",
        }}
        onClick={() => alert("Salle 7")}
        aria-label="Salle 7"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 7");
        }}
      >
        Salle 7
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "51%",
          left: "55%",
          width: "5%",
          height: "9%",
        }}
        onClick={() => alert("Salle 8")}
        aria-label="Salle 8"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 8");
        }}
      >
        Salle 8
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "62%",
          left: "55%",
          width: "5%",
          height: "20%",
        }}
        onClick={() => alert("Salle 9")}
        aria-label="Salle 9"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 9");
        }}
      >
        Salle 9
      </div>

      <div
        className="absolute cursor-pointer bg-transparent flex justify-center items-center text-black font-semibold"
        style={{
          top: "85%",
          left: "55%",
          width: "5%",
          height: "13%",
        }}
        onClick={() => alert("Salle 10")}
        aria-label="Salle 10"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 10");
        }}
      >
        S. 10
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "52%",
          left: "61%",
          width: "6%",
          height: "9%",
        }}
        onClick={() => alert("Salle 11")}
        aria-label="Salle 11"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 11");
        }}
      >
        Salle 11
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "36%",
          left: "61.5%",
          width: "6%",
          height: "9%",
        }}
        onClick={() => alert("Salle 12")}
        aria-label="Salle 12"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 12");
        }}
      >
        Salle 12
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "23%",
          left: "61.5%",
          width: "6%",
          height: "12%",
        }}
        onClick={() => alert("Salle 13")}
        aria-label="Salle 13"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 13");
        }}
      >
        Salle 13
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "46%",
          left: "68%",
          width: "5%",
          height: "14%",
        }}
        onClick={() => alert("Salle 14")}
        aria-label="Salle 14"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 14");
        }}
      >
        Salle 14
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "45%",
          left: "74%",
          width: "11%",
          height: "14%",
        }}
        onClick={() => alert("Salle 15")}
        aria-label="Salle 15"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 15");
        }}
      >
        Salle 15
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "45%",
          left: "85.5%",
          width: "5.5%",
          height: "14%",
        }}
        onClick={() => alert("Salle 16")}
        aria-label="Salle 16"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 16");
        }}
      >
        Salle 16
      </div>

      <div
        className="absolute cursor-pointer bg-red-400 bg-opacity-30 flex justify-center items-center text-white font-semibold"
        style={{
          top: "44%",
          left: "91.8%",
          width: "4.5%",
          height: "14%",
        }}
        onClick={() => alert("Salle 17")}
        aria-label="Salle 17"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") alert("Salle 17");
        }}
      >
        S. 17
      </div>
    </div>
  );
}
