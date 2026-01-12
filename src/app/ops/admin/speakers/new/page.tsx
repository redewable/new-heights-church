import { SpeakerForm } from "../_components/SpeakerForm";

export default function NewSpeakerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-sm text-text-primary">Add Speaker</h1>
        <p className="text-text-secondary">Create a new speaker profile</p>
      </div>

      <SpeakerForm />
    </div>
  );
}