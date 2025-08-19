#import "FloatingBubble.h"
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>

@interface FloatingBubble ()
@property (nonatomic, strong) UIWindow *floatingWindow;
@property (nonatomic, strong) UIView *floatingView;
@property (nonatomic, assign) BOOL isVisible;
@property (nonatomic, strong) UIPanGestureRecognizer *panGesture;
@end

@implementation FloatingBubble

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onPositionChanged"];
}

RCT_EXPORT_METHOD(show:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            if (self.isVisible) {
                [self hideFloatingBubble];
            }
            
            [self createFloatingBubbleWithConfig:config];
            resolve(@YES);
        } @catch (NSException *exception) {
            reject(@"SHOW_ERROR", exception.reason, nil);
        }
    });
}

RCT_EXPORT_METHOD(hide:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [self hideFloatingBubble];
            resolve(@YES);
        } @catch (NSException *exception) {
            reject(@"HIDE_ERROR", exception.reason, nil);
        }
    });
}

RCT_EXPORT_METHOD(isVisible:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@(self.isVisible));
}

RCT_EXPORT_METHOD(updatePosition:(NSDictionary *)position
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            if (self.floatingWindow && self.isVisible) {
                CGFloat x = [position[@"x"] floatValue];
                CGFloat y = [position[@"y"] floatValue];
                
                CGRect frame = self.floatingWindow.frame;
                frame.origin.x = x;
                frame.origin.y = y;
                self.floatingWindow.frame = frame;
                
                resolve(@YES);
            } else {
                reject(@"NOT_VISIBLE", @"Floating bubble is not visible", nil);
            }
        } @catch (NSException *exception) {
            reject(@"UPDATE_POSITION_ERROR", exception.reason, nil);
        }
    });
}

RCT_EXPORT_METHOD(getPosition:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            if (self.floatingWindow && self.isVisible) {
                CGRect frame = self.floatingWindow.frame;
                NSDictionary *position = @{
                    @"x": @(frame.origin.x),
                    @"y": @(frame.origin.y)
                };
                resolve(position);
            } else {
                resolve([NSNull null]);
            }
        } @catch (NSException *exception) {
            reject(@"GET_POSITION_ERROR", exception.reason, nil);
        }
    });
}

RCT_EXPORT_METHOD(updateConfig:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            if (self.isVisible) {
                [self hideFloatingBubble];
                [self createFloatingBubbleWithConfig:config];
            }
            resolve(@YES);
        } @catch (NSException *exception) {
            reject(@"UPDATE_CONFIG_ERROR", exception.reason, nil);
        }
    });
}

RCT_EXPORT_METHOD(requestOverlayPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // iOS doesn't require overlay permission like Android
    resolve(@YES);
}

RCT_EXPORT_METHOD(hasOverlayPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // iOS doesn't require overlay permission like Android
    resolve(@YES);
}

#pragma mark - Private Methods

- (void)createFloatingBubbleWithConfig:(NSDictionary *)config
{
    // Get configuration values
    CGFloat size = config[@"size"] ? [config[@"size"] floatValue] : 100.0;
    CGFloat x = config[@"x"] ? [config[@"x"] floatValue] : 0.0;
    CGFloat y = config[@"y"] ? [config[@"y"] floatValue] : 100.0;
    BOOL draggable = config[@"draggable"] ? [config[@"draggable"] boolValue] : YES;
    
    // Create floating window
    self.floatingWindow = [[UIWindow alloc] initWithFrame:CGRectMake(x, y, size, size)];
    self.floatingWindow.windowLevel = UIWindowLevelAlert + 1;
    self.floatingWindow.backgroundColor = [UIColor clearColor];
    self.floatingWindow.hidden = NO;
    
    // Create floating view
    self.floatingView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, size, size)];
    self.floatingView.layer.cornerRadius = size / 2;
    self.floatingView.clipsToBounds = YES;
    
    // Set background color
    UIColor *backgroundColor = [UIColor systemBlueColor]; // Default color
    if (config[@"backgroundColor"]) {
        backgroundColor = [self colorFromHexString:config[@"backgroundColor"]];
    }
    self.floatingView.backgroundColor = backgroundColor;
    
    // Add border if specified
    if (config[@"borderColor"] && config[@"borderWidth"]) {
        self.floatingView.layer.borderColor = [self colorFromHexString:config[@"borderColor"]].CGColor;
        self.floatingView.layer.borderWidth = [config[@"borderWidth"] floatValue];
    }
    
    // Add text if specified
    if (config[@"text"]) {
        UILabel *textLabel = [[UILabel alloc] initWithFrame:self.floatingView.bounds];
        textLabel.text = config[@"text"];
        textLabel.textAlignment = NSTextAlignmentCenter;
        textLabel.textColor = config[@"textColor"] ? [self colorFromHexString:config[@"textColor"]] : [UIColor whiteColor];
        textLabel.font = [UIFont systemFontOfSize:config[@"textSize"] ? [config[@"textSize"] floatValue] : 16.0];
        textLabel.adjustsFontSizeToFitWidth = YES;
        textLabel.minimumScaleFactor = 0.5;
        [self.floatingView addSubview:textLabel];
    }
    
    // Add drag gesture if draggable
    if (draggable) {
        self.panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handlePan:)];
        [self.floatingView addGestureRecognizer:self.panGesture];
    }
    
    [self.floatingWindow addSubview:self.floatingView];
    self.isVisible = YES;
}

- (void)hideFloatingBubble
{
    if (self.floatingWindow) {
        self.floatingWindow.hidden = YES;
        self.floatingWindow = nil;
        self.floatingView = nil;
        self.panGesture = nil;
        self.isVisible = NO;
    }
}

- (void)handlePan:(UIPanGestureRecognizer *)gesture
{
    CGPoint translation = [gesture translationInView:gesture.view.superview];
    
    if (gesture.state == UIGestureRecognizerStateChanged) {
        CGRect frame = self.floatingWindow.frame;
        frame.origin.x += translation.x;
        frame.origin.y += translation.y;
        
        // Keep within screen bounds
        CGRect screenBounds = [UIScreen mainScreen].bounds;
        frame.origin.x = MAX(0, MIN(frame.origin.x, screenBounds.size.width - frame.size.width));
        frame.origin.y = MAX(0, MIN(frame.origin.y, screenBounds.size.height - frame.size.height));
        
        self.floatingWindow.frame = frame;
        [gesture setTranslation:CGPointZero inView:gesture.view.superview];
    } else if (gesture.state == UIGestureRecognizerStateEnded) {
        // Send position update event
        CGRect frame = self.floatingWindow.frame;
        NSDictionary *position = @{
            @"x": @(frame.origin.x),
            @"y": @(frame.origin.y)
        };
        [self sendEventWithName:@"onPositionChanged" body:position];
    }
}

- (UIColor *)colorFromHexString:(NSString *)hexString
{
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    if ([hexString hasPrefix:@"#"]) {
        [scanner setScanLocation:1]; // bypass '#' character
    }
    [scanner scanHexInt:&rgbValue];
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0
                           green:((rgbValue & 0xFF00) >> 8)/255.0
                            blue:(rgbValue & 0xFF)/255.0
                           alpha:1.0];
}

- (void)dealloc
{
    [self hideFloatingBubble];
}

@end