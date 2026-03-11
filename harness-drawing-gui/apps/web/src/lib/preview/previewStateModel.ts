export type ResourceStatus = "idle" | "loading" | "loaded" | "error";

export type ResourceState<T> = {
  status: ResourceStatus;
  data: T | null;
  error: string | null;
};

export function createIdleResourceState<T>(): ResourceState<T> {
  return {
    status: "idle",
    data: null,
    error: null,
  };
}

export function toLoadingState<T>(previous: ResourceState<T>): ResourceState<T> {
  return {
    status: "loading",
    data: previous.data,
    error: null,
  };
}

export function toLoadedState<T>(data: T): ResourceState<T> {
  return {
    status: "loaded",
    data,
    error: null,
  };
}

export function toErrorState<T>(previous: ResourceState<T>, error: string): ResourceState<T> {
  return {
    status: "error",
    data: previous.data,
    error,
  };
}
