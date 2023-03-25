import { useState } from 'react';
import { Vector3, Quaternion } from 'three';

interface ObjectState {
  position: Vector3;
}

export function useInterpolation() {
  const [lastState, setLastState] = useState<ObjectState | null>(null);
  const [currentState, setCurrentState] = useState<ObjectState | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  function updateState(newState: ObjectState) {
    setLastState(currentState);
    setCurrentState(newState);
    setLastUpdateTime(Date.now());
  }

  return { lastState, currentState, lastUpdateTime, updateState };
}