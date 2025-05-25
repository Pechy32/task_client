/**
 * InputField Component
 * 
 * A flexible input component that supports various input types such as text, number, date, 
 * and textarea. It handles validation for required fields, minimum values/lengths, and renders 
 * the appropriate input element based on the provided type.
 * 
 * Props:
 * - label (string): The label text for the input field.
 * - name (string): The name attribute for the input/textarea element.
 * - type (string): The type of input, which can be 'text', 'number', 'date', or 'textarea'.
 * - value (string|number): The current value of the input field.
 * - required (boolean): Whether the input field is required. Defaults to false.
 * - prompt (string): Placeholder text for the input field.
 * - min (string|number): The minimum value (for 'number' and 'date') or minimum length (for 'text' and 'textarea').
 * - rows (number): The number of rows for a textarea element.
 * - handleChange (function): The function to call when the value of the input changes.
 * 
 * @param {object} props - The props object for the InputField component.
 * @returns {JSX.Element|null} The rendered input or textarea element, or null if the type is unsupported.
 */
export function InputField({
  label,
  name,
  type,
  value,
  required = false,
  prompt,
  min,
  rows,
  handleChange,
}) {
  // Supported input types for <input> element
  const INPUTS = ["text", "number", "date"];

  // Validate the input type and determine if it's a textarea
  const lowerCaseType = type.toLowerCase();
  const isTextarea = lowerCaseType === "textarea";

  // Return null if the type is unsupported
  if (!isTextarea && !INPUTS.includes(lowerCaseType)) {
    return null;
  }

  // Determine the minimum value/length attributes based on input type
  const minLength = ["text", "textarea"].includes(lowerCaseType) ? min : null;
  const minValue = ["number", "date"].includes(lowerCaseType) ? min : null;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>

      {/* Render the appropriate input or textarea element */}
      {isTextarea ? (
        <textarea
          required={required}
          className="form-control"
          placeholder={prompt}
          rows={rows}
          minLength={minLength}
          name={name}
          value={value}
          onChange={handleChange}
          id={name}
        />
      ) : (
        <input
          required={required}
          type={lowerCaseType}
          className="form-control"
          placeholder={prompt}
          minLength={minLength}
          min={minValue}
          name={name}
          value={value}
          onChange={handleChange}
          id={name}
        />
      )}
    </div>
  );
}

export default InputField;