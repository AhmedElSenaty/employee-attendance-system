import {
  useId, // Hook to generate a unique ID
  cloneElement, // Function to clone and modify React elements
  ReactNode, // Type for valid React children elements
  HTMLAttributes, // Type for standard HTML element attributes
  isValidElement, // Function to check if a value is a valid React element
  Children, // Utility to work with React children
  ReactElement,
  memo, // Type representing a valid React element
} from "react";

// Define the props interface for the Field component
interface IProps extends HTMLAttributes<HTMLDivElement> {
  id?: string; // Optional ID that can be assigned to the input element
  children: ReactNode; // Accepts any valid React children elements
}

// Field component definition
const Field = ({ id = "", children, ...rest }: IProps) => {
  // Generate a unique ID using the `useId` hook.
  // This ensures that the input element inside the Field has a unique ID.
  const generatedId = useId();

  // Use the provided `id` prop if given; otherwise, fall back to the generated ID.
  const inputId = id || generatedId;

  /**
   * Recursively processes each child element to assign necessary attributes.
   * 
   * - If a `label` is found, but it's missing `htmlFor`, it gets assigned the `inputId`.
   * - If an `input` is found without an `id`, it gets assigned `inputId`.
   * - If an element has children, it recursively processes them.
   */
  const processChildren = (child: ReactNode): ReactNode => {
    // Ensure the child is a valid React element before proceeding.
    if (!isValidElement(child)) return child;

    // Get the child element's type.
    // - If it's a string (e.g., "input", "label"), use it as is.
    // - If it's a React component, check for its `displayName` (if available).
    const childType =
      typeof child.type === "string"
        ? child.type
        : (child.type as { displayName?: string }).displayName;

    // Extract the existing properties of the child.
    const childProps = child.props as Record<string, unknown>;

    // Retrieve existing `htmlFor` and `id` attributes from the child.
    const htmlFor = childProps.htmlFor as string | undefined;
    const childId = childProps.id as string | undefined;

    // Retrieve the `children` prop, which may contain nested elements.
    const childChildren = childProps.children as ReactNode | undefined;

    // Object to store new properties that will be assigned to the cloned element.
    const newProps: Record<string, unknown> = {};

    // If the child is a `label` and it does not have an `htmlFor` attribute, assign one.
    if (childType === "label" && !htmlFor) {
      newProps.htmlFor = inputId;
    }
    // If the child is an `input` and it does not have an `id` attribute, assign one.
    if ((childType === "input" || childType === "checkbox" || childType === "radio" || childType === "selectbox" || childType === "textarea") && !childId) {
      newProps.id = inputId;
    }

    // If the element has children, recursively process them.
    // Ensure that `children` is not a string (to avoid modifying text content).
    if (childChildren && typeof childChildren !== "string") {
      newProps.children = Children.map(childChildren, processChildren);
    }

    // Only clone the element if there's a property to modify.
    return Object.keys(newProps).length > 0
      ? cloneElement(child as ReactElement, newProps)
      : child;
  };

  // Render the Field component as a `div`, passing down additional props (`...rest`).
  // - Maps over `children`, applying `processChildren` to ensure `label` and `input` elements are updated accordingly.
  return <div {...rest}>{Children.map(children, processChildren)}</div>;
};

export default memo(Field);
