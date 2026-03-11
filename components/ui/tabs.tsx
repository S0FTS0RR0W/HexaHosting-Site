import type React from "react";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  defaultValue,
  value: valueProp,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  const [valueState, setValueState] = useState(defaultValue ?? "");
  const value = valueProp !== undefined ? valueProp : valueState;

  const setValue = (val: string) => {
    if (valueProp === undefined) {
      setValueState(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex", className)} {...props} />;
}

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }
  const { value: current, setValue } = context;
  const isActive = current === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        "px-3 py-2 text-sm font-medium",
        isActive
          ? "border-b-2 border-primary"
          : "border-b-2 border-transparent",
        className,
      )}
      onClick={() => setValue(value)}
      {...props}
    />
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  children,
  className,
  ...props
}: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }
  const { value: current } = context;
  return current === value ? (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  ) : null;
}
