import State from './state';

export default interface Renderer {

    render(state: State): void;
    
}