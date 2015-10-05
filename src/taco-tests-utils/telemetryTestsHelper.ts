﻿/**
﻿ *******************************************************
﻿ *                                                     *
﻿ *   Copyright (C) Microsoft. All rights reserved.     *
﻿ *                                                     *
﻿ *******************************************************
﻿ */

"use strict";

import promisesUtils = require("../taco-utils/promisesUtils");
import telemetryHelper = require("../taco-utils/telemetryHelper");
import telemetry = require("../taco-utils/telemetry");
import Telemetry = telemetry.Telemetry;

module TelemetryTestsHelper {
    export class FakeTelemetryGenerator extends telemetryHelper.TelemetryGeneratorBase {
        private eventsProperties: TacoUtility.ICommandTelemetryProperties[] = [];

        public getEventsProperties(): TacoUtility.ICommandTelemetryProperties[] {
            return this.eventsProperties;
        }

        protected sendTelemetryEvent(telemetryEvent: Telemetry.TelemetryEvent): void {
            this.eventsProperties.push(this.telemetryProperties);
        }
    }

    export class FakeTelemetryHelper implements TacoUtility.TelemetryGeneratorFactory {
        private telemetryGenerators: FakeTelemetryGenerator[] = [];

        public getTelemetryGenerators(): FakeTelemetryGenerator[] {
            return this.telemetryGenerators;
        }

        public getAllEvents(): TacoUtility.ICommandTelemetryProperties[] {
            var listOfListOfEvents = this.telemetryGenerators.map((fakeGenerator: FakeTelemetryGenerator) =>
                fakeGenerator.getEventsProperties()); var listOfEvents = Array.prototype.concat.apply([], listOfListOfEvents);
            return listOfEvents;
        }

        public generate<T>(componentName: string, codeGeneratingTelemetry: { (telemetry: TacoUtility.TelemetryGenerator): T }): T {
            var generator = new FakeTelemetryGenerator(componentName);
            this.telemetryGenerators.push(generator);
            return promisesUtils.PromisesUtils.executeAfter(generator.time(null, () => codeGeneratingTelemetry(generator)), () => generator.send());
        }
    }
}

export = TelemetryTestsHelper;
