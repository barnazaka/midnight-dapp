import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  test(context: __compactRuntime.CircuitContext<PS>,
       c_0: Uint8Array,
       r_0: bigint,
       s_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  test(context: __compactRuntime.CircuitContext<PS>,
       c_0: Uint8Array,
       r_0: bigint,
       s_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  cmt: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
