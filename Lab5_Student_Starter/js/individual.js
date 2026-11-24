"use strict";

const noteInput = document.querySelector("#individual-note-input");
const noteSave = document.querySelector("#individual-note-save");
const noteClear = document.querySelector("#individual-note-clear");
const noteStatus = document.querySelector("#individual-note-status");
const noteBox = document.querySelector("#individual-note-box");
const noteOutput = document.querySelector("#individual-note-output");

function saveIndividualNote() {
  const text = noteInput.value.trim();
  if (!text) {
    noteStatus.textContent = "Please enter some text before saving a note.";
    noteInput.focus();
    return;
  }
  noteOutput.textContent = text;
  noteBox.classList.remove("is-hidden");
  noteClear.disabled = false;
  noteInput.value = "";
  noteStatus.textContent = "Note saved.";
}

function clearIndividualNote() {
  noteOutput.textContent = "";
  noteBox.classList.add("is-hidden");
  noteInput.value = "";
  noteClear.disabled = true;
  noteStatus.textContent = "Note cleared.";
}

if (noteInput && noteSave && noteClear && noteStatus && noteBox && noteOutput) {
  noteSave.addEventListener("click", saveIndividualNote);
  noteClear.addEventListener("click", clearIndividualNote);
  noteClear.disabled = true;
}