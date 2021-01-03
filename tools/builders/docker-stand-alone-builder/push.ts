import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';

import { Observable } from 'rxjs';

/**
 * Builder for docker stand-alone push target.
 */
export default createBuilder((options: unknown, context: BuilderContext) => new Observable<BuilderOutput>((observer) => observer.next({ success: true })));
